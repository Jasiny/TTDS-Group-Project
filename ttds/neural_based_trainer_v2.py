# from transformers import RobertaTokenizer, RobertaModel
from tqdm import tqdm
import pickle

# from nltk.corpus import wordnet as wn
from matplotlib import pyplot as plt
import os

import torch
from torch.nn import Parameter
import torch.optim as optim
import math
from torch.utils.data import (
    Dataset, DataLoader,
    SequentialSampler, RandomSampler
)

import torch.nn.functional as F
import torch.nn as nn

from transformers import get_linear_schedule_with_warmup
from transformers import AdamW
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer,AutoModel


import random

class DatasetRetriever(torch.utils.data.Dataset):
    def __init__(self, inputs, targets):
        self.inputs = inputs
        self.targets = targets
        # self.neg = neg
        # self.ratio=ratio
    
    def __len__(self):
        return len(self.targets)
    
    def __getitem__(self, index):
        # random_number indicates whether use the negtive example
        random_number=random.randint(0,100)
        # lift for index neg example
        lift=random.randint(0,len(self.targets))
        
        input_id = self.inputs[index]

        target = self.targets[index]

        # randomly select one ground truth
        neg = self.targets[index-lift]

        return {"input": input_id, "target": target, "neg":neg,"random":random_number }
        # ,"name_id":name_id}


from sklearn.model_selection import train_test_split


# data
# part
#
#

with open ("aug_merged","rb") as fin:
    X_def = pickle.load(fin)
with open ("name","rb") as fin:
    name = pickle.load(fin)

with open ("def","rb") as fin:
    y_def = pickle.load(fin)



train_dataset = DatasetRetriever(X_def,y_def)
test_dataset = DatasetRetriever(X_def,y_def)

train_dataloader = DataLoader(
        train_dataset,
        batch_size=16, 
        sampler=SequentialSampler(train_dataset),
        num_workers=0
    )

test_dataloader = DataLoader(
        test_dataset,
        batch_size=1, 
        sampler=SequentialSampler(test_dataset),
        num_workers=0
    )



# model part
#
#


tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-mpnet-base-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-mpnet-base-v2')

model.cuda(0)


optimizer = AdamW(params=model.parameters(), lr=1e-5, correct_bias=True)

num_epochs = 8
num_training_steps = num_epochs * len(train_dataloader)
lr_scheduler = get_linear_schedule_with_warmup(
        optimizer=optimizer,
        num_warmup_steps=500,
        num_training_steps=num_training_steps,
    )


device=torch.device("cuda")
model.train()
max_length=128
scale=20.0

max_grad_norm = 1

cross_entropy_loss = nn.CrossEntropyLoss()
neg_ratio=20

# compute loss


#Mean Pooling - Take attention mask into account for correct averaging
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

model.train()   
train_dataloader

for i in range(num_epochs):
    for batch_data in tqdm(train_dataloader):

        # if use negtive example 
        if batch_data["random"]<neg_ratio:
           
            # batch_data["target"]="sdsd  the an we i see who"
            encoded_input1 = tokenizer( batch_data["target"], return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")
            encoded_input2 = tokenizer( batch_data["input"], return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")
            encoded_input3 = tokenizer( batch_data["neg"], return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")
        
            
            ### Compute embeddings

            output1 = model(**encoded_input1.to(device))
            output2 = model(**encoded_input2.to(device))
            output3 = model(**encoded_input3.to(device))

            embedding1 = mean_pooling(output1, encoded_input1['attention_mask'])
            embedding2 = mean_pooling(output2, encoded_input2['attention_mask'])
            embedding3 = mean_pooling(output3, encoded_input3['attention_mask'])

            embedding1= F.normalize(embedding1, p=2, dim=1)
            embedding2= F.normalize(embedding2, p=2, dim=1)
            embedding3= F.normalize(embedding3, p=2, dim=1)

            embedding2 = torch.cat([embedding2.T, embedding3.T])
            
            ### similarity scores 
            scores = torch.mm(embedding1.transpose(0, 1), embedding2.transpose(0, 1)) * scale
           
            ### indicator for cross-entropy loss
            labels = torch.tensor(range(len(scores)), dtype=torch.long, device=embedding1.device)  # Example a[i] should match with b[i]

            loss = cross_entropy_loss(scores, labels)
          
         # if only positive example 
        else:
            encoded_input1 = tokenizer( batch_data["target"], return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")
            encoded_input2 = tokenizer( batch_data["input"], return_tensors="pt", max_length=max_length, truncation=True, padding="max_length")

            output1 = model(**encoded_input1.to(device))
            output2 = model(**encoded_input2.to(device))
                

            embedding1 = mean_pooling(output1, encoded_input1['attention_mask'])
            embedding2 = mean_pooling(output2, encoded_input2['attention_mask'])
            

            embedding1= F.normalize(embedding1, p=2, dim=1)
            embedding2= F.normalize(embedding2, p=2, dim=1)

            scores = torch.mm(embedding1.transpose(0, 1), embedding2) * scale

            labels = torch.tensor(range(len(scores)), dtype=torch.long, device=embedding1.device)
            
            #  CLIP loss
            loss = (cross_entropy_loss(scores, labels) + cross_entropy_loss(scores.transpose(0, 1), labels)) / 2

        loss.backward()

        torch.nn.utils.clip_grad_norm_(model.parameters(), max_grad_norm)

        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()
        
            

    with open ("sen-model"+str(i),"wb") as fout:
            pickle.dump(model,fout)


   
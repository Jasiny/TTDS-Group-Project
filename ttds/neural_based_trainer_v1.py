from transformers import RobertaTokenizer, RobertaModel
from tqdm import tqdm
import pickle

from nltk.corpus import wordnet as wn
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

from transformers import get_scheduler
from transformers import AdamW



with open ("embedding"+"333","rb") as fin:
    y_dict=pickle.load(fin)

x_raw=[]
y_raw=[]
all_word_embeding=[]

for i in y_dict.keys():
    all_word_embeding.append(y_dict[i])

# id dict for label
label_id_dic={}
for i,c in enumerate(y_dict.keys()):
    label_id_dic[c]=i





class DatasetRetriever(torch.utils.data.Dataset):
    def __init__(self, inputs, targets):
        self.inputs = inputs
        self.targets = targets
    
    def __len__(self):
        return len(self.targets)
    
    def __getitem__(self, index):
        # def
        input_ids = torch.tensor(self.inputs["input_ids"][index]).squeeze()
        # embedding of word
        target=y_dict[self.targets[index]].squeeze()
        # id in the whole dic
        name_id= label_id_dic[self.targets[index]]

        return {"input_ids": input_ids, "labels": target,"name_id":name_id}


from sklearn.model_selection import train_test_split



for word in tqdm(wn.all_synsets()):
    # e.g. Synset('able.a.01')
    word_name =(word.name().split('.')[0])
    word_def= word.definition()

    x_raw.append( word_def)
    
    y_raw.append( word_name)
    


all_word_embeding=torch.stack(all_word_embeding)
all_word_embeding=torch.squeeze(all_word_embeding).cuda()
all_word_embeding.requires_grad_=False
print(all_word_embeding.shape)


x_train, x_test, y_train, y_test = train_test_split(x_raw, y_raw, test_size=0.1, random_state=102010)



tokenizer = RobertaTokenizer.from_pretrained('roberta-base')


x_train=tokenizer(x_train, padding=True,return_tensors="pt")
x_test=tokenizer(x_test, padding=True,return_tensors="pt")


train_dataset = DatasetRetriever(x_train,y_train)
test_dataset = DatasetRetriever(x_test,y_test)


train_dataloader = DataLoader(
        train_dataset,
        batch_size=1, 
        sampler=SequentialSampler(train_dataset),
        num_workers=0
    )

test_dataloader = DataLoader(
        test_dataset,
        batch_size=1, 
        sampler=SequentialSampler(test_dataset),
        num_workers=0
    )




class RDModel(nn.Module):
    def __init__(self):
        super(RDModel, self).__init__()
        
        self.base_model = RobertaModel.from_pretrained('roberta-base')
        self.dropout = nn.Dropout(0.3)
  
    def forward(self, input_ids):
        outputs = self.base_model(input_ids)
        # output[0]: last_hidden_state
        # output[1]: pooler_output
        outputs = self.dropout(outputs[1])
        
        return outputs





with open ("model","rb") as fin:
    model=pickle.load(fin)
# model = RDModel()

model.cuda(0)



optimizer = AdamW(model.parameters(), lr=1e-4)

num_epochs = 3
num_training_steps = num_epochs * len(train_dataloader)
lr_scheduler = get_scheduler("linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps)


model.train()

# compute loss
# loss = F.cross_entropy(input=output, target=word_embed)          
criterion =nn.CosineEmbeddingLoss()
y = torch.ones(1).cuda()
y.requires_grad_=False

evaluate_cos=nn.CosineSimilarity(dim=1,eps=1e-6)
softmax = nn.Softmax()

for i in range(num_epochs):

    # training stage
    for batch_data in tqdm(train_dataloader):
        input_ids= batch_data['input_ids']

        # embedding of word
        word_embed=batch_data['labels']
        word_embed.cuda()
        word_embed.requires_grad_=False

        # embedding of def
        output= model(input_ids=input_ids.cuda())#.pooler_output
        
        
        
        loss =criterion(output,word_embed,y)
        loss.backward()
        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()


    # testing stage

    with torch.no_grad():
        model.eval()
        # for batch_data in tqdm(test_dataloader):
        for batch_data in tqdm(train_dataloader):
            input_ids= batch_data['input_ids']

            # embedding of word

            gt_id=batch_data['name_id'].cuda()

            # here need to fine the id of word
           
            # embedding of def
            output= model(input_ids=input_ids.cuda())

            # dot product with all word embedding
            # softmax,  get the top n results 
            # ouput(1,768)  all_word_embeding(117659,768)
           

            results= evaluate_cos(output,all_word_embeding)

            # softmax the results
            results=softmax(results)


            top_results=torch.topk(results,10)
            
         


        with open ("model"+str(num_epochs),"wb") as fout:
            pickle.dump(model,fout)

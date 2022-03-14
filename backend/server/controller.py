import json
import os
import pickle

import numpy as np
import torch
from django.conf import settings
from django.http import JsonResponse
from faiss import METRIC_INNER_PRODUCT, index_factory
from faiss.swigfaiss import IndexFlat
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import normalize

from server.utils import *

# load data
data_dict = {}
with open(os.path.join(settings.BASE_DIR, 'data/data_final.json'), 'r') as f:
    for i in json.load(f):
        data_dict[i['word']] = set(i['definitions'])

with open(os.path.join(settings.BASE_DIR, 'data/word2pos.json'), 'r') as f:
    word2pos = json.load(f)

# load traditional model
with open(os.path.join(settings.BASE_DIR, 'models/traditional.pkl'), 'rb') as f:
    traditional = pickle.load(f)

traditional_model = traditional['model']
traditional_knn = traditional['knn']
traditional_y = traditional['y']


# load neural model
device = torch.device("cpu")

with open(os.path.join(settings.BASE_DIR, 'models/neural/final_model'), 'rb') as f:
    neural_model = pickle.load(f)
    neural_model.eval()
with open(os.path.join(settings.BASE_DIR, 'models/neural/tokenizer'), 'rb') as f:
    neural_tokenizer = pickle.load(f)
with open(os.path.join(settings.BASE_DIR, 'models/neural/name'), 'rb') as f:
    neural_y = pickle.load(f)
with open(os.path.join(settings.BASE_DIR, 'models/neural/all-word2'), 'rb') as f:
    neural_X_embed = np.array(pickle.load(f)).astype(np.float32)  # (117659, 768)
    neural_X_embed = normalize(neural_X_embed)

neural_index = index_factory(neural_X_embed.shape[1], "Flat", METRIC_INNER_PRODUCT)
neural_index.add(neural_X_embed)


def search(query, model, y, n=500):
    if type(model) == NearestNeighbors:
        dist, nbrs = model.kneighbors(query, n_neighbors=n)
        similarity = 1 - dist
    elif type(model) == IndexFlat:
        similarity, nbrs = model.search(query, n)
    words = [{
        'word': y[i],
        'pos': word2pos[(y[i].replace('-', '_'))] if y[i].replace('-', '_') in word2pos else [],
        'defitions': list(data_dict[(y[i].replace('-', '_'))]) if y[i].replace('-', '_') in data_dict else ['Definition Not Found.'],
        'score':f'{score:.3f}'
    } for i, score in zip(nbrs[0], similarity[0])]
    return words


def handle_request(request):
    query = request.GET['query']
    engine = request.GET['engine']
    sent_time = request.GET['sentTime']

    if engine == 'Traditional':
        query_vec = traditional_model.transform(query)
        model = traditional_knn
        y = traditional_y
    elif engine == 'Neural':
        query_vec = normalize(np.array(get_embed(query, neural_model, neural_tokenizer)).astype(np.float32))
        model = neural_index
        y = neural_y

    words = search(query_vec, model, y)

    res = {
        'words': words,
        'time': get_res_time(sent_time)
    }

    return JsonResponse(res)

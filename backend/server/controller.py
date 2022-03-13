import json
import os
import pickle
import re
import sys
from collections import Counter
from pathlib import Path

import numpy as np
from django.conf import settings
from django.http import JsonResponse
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from scipy.sparse import csr_matrix
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import normalize

from server.utils import get_res_time

# load data
data_dict = {}
with open(os.path.join(settings.BASE_DIR, 'data/data_5d.json'), 'r') as f:
    for i in json.load(f):
        data_dict[i['word']] = set(i['definitions'])


# load traditional model
with open(os.path.join(settings.BASE_DIR, 'models/traditional.pkl'), 'rb') as f:
    traditional = pickle.load(f)

traditional_model = traditional['model']
traditional_knn = traditional['knn']
traditional_y = traditional['y']


def search(query, knn, y, n=100):
    dist, nbrs = knn.kneighbors(query, n_neighbors=n)
    words = [{
        'word': y[i],
        'defi': list(data_dict[y[i]]) if y[i] in data_dict else ['Definition Not Found.'],
        'score':f'{score:.3f}'
    } for i, score in zip(nbrs[0], 1-dist[0])]
    return words


def handle_request(request):
    query = request.GET['query']
    sent_time = request.GET['sentTime']

    query_vec = traditional_model.transform(query)
    knn = traditional_knn
    y = traditional_y

    words = search(query_vec, knn, y)

    res = {
        'words': words,
        'time': get_res_time(sent_time)
    }

    return JsonResponse(res)

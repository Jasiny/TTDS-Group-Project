import os
import pickle

from django.conf import settings
from django.http import JsonResponse
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors

from server.utils import get_res_time

with open(os.path.join(settings.BASE_DIR, 'models/data.pkl'), 'rb') as f:
    data = pickle.load(f)

# embeddings and vectors
X_embeddings = data['X_embeddings']
y = data['y']
# neural model
model = SentenceTransformer('all-mpnet-base-v2')
# knn
knn = NearestNeighbors(metric='cosine')
knn.fit(X_embeddings)


def search(query, knn, y, n=100):
    dist, nbrs = knn.kneighbors([query], n_neighbors=n)
    words = [{
        'word': y[i],
        'score':f'{score:.3f}'
    } for i, score in zip(nbrs[0], 1-dist[0])]
    return words


def handle_request(request):
    query = request.GET['query']
    sent_time = request.GET['sentTime']

    words = search(model.encode(query), knn, y)

    res = {
        'words': words,
        'time': get_res_time(sent_time)
    }

    return JsonResponse(res)

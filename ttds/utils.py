import itertools
import json
import re
import time

import numpy as np
import pandas as pd
import requests
from deprecated import deprecated
from matplotlib import pyplot as plt
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer as Lemmatizer
from tqdm import tqdm


def load_data_from_json(fname, use_examples=False):
    '''
    Load data dictionary from local json file.
    '''
    data = {}
    with open(fname, 'r') as f:
        for i in json.load(f):
            word = i['word']
            defi = i['definitions']
            data[word] = set(defi)
            if use_examples and 'examples' in i:
                examples = i['examples']
                if len(examples) > 0:
                    for j, example in enumerate(examples.copy()):
                        # masking
                        examples[j] = example.replace(word, ' ')
                    data[word] = data[word].union(examples)
    return data


def load_pos_from_json(fname):
    '''
    Load POS dictionary from local json file.
    '''
    with open(fname, 'r') as f:
        word2pos = json.load(f)
        words_noun = []
        words_verb = []
        words_adj = []
        words_adv = []
        for word, pos_list in word2pos.items():
            if 'noun' in pos_list:
                words_noun.append(word)
            if 'verb' in pos_list:
                words_verb.append(word)
            if 'adj' in pos_list:
                words_adj.append(word)
            if 'adv' in pos_list:
                words_adv.append(word)
        print(f'Num of Noun words: {len(words_noun)} ({len(words_noun) / len(word2pos)*100:.2f}%)')
        print(f'Num of Verb words: {len(words_verb)} ({len(words_verb) / len(word2pos)*100:.2f}%)')
        print(f'Num of Adj  words: {len(words_adj)} ({len(words_adj) / len(word2pos)*100:.2f}%)')
        print(f'Num of Adv  words: {len(words_adv)} ({len(words_adv) / len(word2pos)*100:.2f}%)')
        return word2pos, words_noun, words_verb, words_adj, words_adv


def show_data_stats(data, title='', plot=False, concat=False):
    '''
    Print out statistical details of data.
    '''
    if concat:
        all_defi = [' '.join(i) for i in data.values()]
    else:
        all_defi = list(itertools.chain(*data.values()))
    l = np.array([len(defi.split()) for defi in all_defi])
    print(f'num of words: {len(set(data.keys()))}')
    print(f'num of docs: {len(all_defi)}')
    print(f'max doc length: {np.max(l)}')
    print(f'min doc length: {np.min(l)}')
    print(f'mean doc length: {round(np.mean(l), 2)}')
    print(f'median doc length: {np.median(l)}')
    if plot:
        plt.title(title)
        plt.xlabel('doc length')
        plt.ylabel('num of docs')
        plt.hist(l, bins=50)
        plt.show()


def search(query, knn, y, n=1000):
    dist, nbrs = knn.kneighbors(query, n_neighbors=n)
    return list(np.array(y)[nbrs[0]])


def evaluate(y_pred, y_gold):
    '''
    Evaluate accuracy@1, @10, @100, median rank, rank variance.
        y_pred: 200 predicted lists.
                e.g. size (200, 1000) for 1000 returned words each time for 200 target words
        y_gold: ground truth target words with size (200,)

    '''
    acc_1 = 0.
    acc_10 = 0.
    acc_100 = 0.
    pred_rank = []
    length = len(y_gold)

    for i in range(length):
        try:
            pred_rank.append(y_pred[i][:].index(y_gold[i]))
        except:
            pred_rank.append(1000)
        if y_gold[i] in y_pred[i][:100]:
            acc_100 += 1
            if y_gold[i] in y_pred[i][:10]:
                acc_10 += 1
                if y_gold[i] == y_pred[i][0]:
                    acc_1 += 1

    acc_1 /= length
    acc_10 /= length
    acc_100 /= length
    median_rank = np.median(pred_rank)
    var_rank = np.sqrt(np.var(pred_rank))

    return acc_1, acc_10, acc_100, median_rank, var_rank

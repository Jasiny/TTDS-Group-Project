import re
from collections import Counter

import numpy as np
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from scipy.sparse import csr_matrix
from sklearn.preprocessing import normalize


class TfidfVectorizer():
    def __init__(self, stop_words=stopwords.words('english'), stemmer=PorterStemmer(), norm=True):
        '''
            stop_words: default using stopwords from nltk
            stemmer: default using PorterStemmer
            norm: default true, using l2 norm
        '''
        self.stop_words = self._preprocess_stop_words(stop_words)
        self.stemmer = stemmer
        self.norm = norm

        self.data = {}      # merged all definitions from the same word
        self.words = []     # all words can be searched, for later KNN indexing
        self.inv_index = {}  # inverted index
        self.num_docs = 0   # number of documents
        self.num_dims = 0   # number of dimensinons for each tf-idf vector, i.e. number of unique words
        self._vocab2id = {}  # a mapping from vocab to id
        self._idf = {}      # a dictionary of idf for all words

    def fit_transform(self, raw_data):
        '''
        Fit raw data and transform to tf-idf matrix.

            raw_data: a dictionary of word and all its definitions
                e.g.
                {
                    word_1: {defi_1, defi_2, defi_3, ...}
                    word_2: {...}
                }
        '''
        ########## merged all definitions from the same word ##########
        for word, defi_set in raw_data.items():
            self.data[word] = ' '.join(defi_set)
        ########## preprocessing ##########
        for word, defi_str in self.data.copy().items():
            self.data[word] = self._preprocess(defi_str)
        ########## inverted index ##########
        self.inv_index, self.words = self._create_inv_index(self.data)
        self.num_docs = len(self.data.values())
        self.num_dims = len(self.inv_index.keys())
        ########## extract idf, as it is shared for every term ##########
        N = self.num_docs
        for index, word in enumerate(self.inv_index.keys()):
            df = self.inv_index[word][0]
            self._idf[word] = np.log10(N / df)
            self._vocab2id[word] = index
        ########## tf-idf matrix ##########
        tfidf_matrix = csr_matrix((self.num_docs, self.num_dims)).tolil()  # tolil(): List of Lists
        for word_index, word in enumerate(self.inv_index.keys()):
            for doc in self.inv_index[word][1].keys():
                tf = self.inv_index[word][1][doc]
                tfidf_matrix[doc, word_index] = (1 + np.log10(tf)) * self._idf[word]
        if self.norm:
            tfidf_matrix = normalize(tfidf_matrix.tocsr())  # normalize
        return tfidf_matrix

    def transform(self, query):
        '''
        Transform query to tf-idf vector.
        '''
        query = self._preprocess(query)
        tfidf_vec = csr_matrix((1, self.num_dims)).tolil()  # tolil(): List of Lists
        for word in query:
            # in case of OOV
            if word in self._vocab2id:
                tf = Counter(query)[word]
                word_index = self._vocab2id[word]
                tfidf_vec[0, word_index] = (1 + np.log10(tf)) * self._idf[word]
        if self.norm:
            tfidf_vec = normalize(tfidf_vec.tocsr())  # normalize
        return tfidf_vec

    def _preprocess(self, text):
        '''
        Preprocessing.
        '''
        text = re.sub(r'[^a-z]', ' ', text.lower())
        words = text.split()
        if self.stop_words:
            words = [word for word in words if word not in self.stop_words]
        if self.stemmer:
            words = [self.stemmer.stem(word) for word in words]
        return words

    def _preprocess_stop_words(self, stopwords):
        '''
        Remove all 'not' from stopwords.
        '''
        if stopwords:
            stopwords.remove('not')
            stopwords = [word for word in stopwords if "n't" not in word]
        return stopwords

    def _create_inv_index(self, data):
        '''
        Create inverted index.

            data: a dictionary of word and its preprocessed definition
                e.g. 
                {
                    word: [term1, term2, term3, ...]
                }
        '''
        definitions = []
        words = []
        for word, term_arr in data.items():
            definitions.append(term_arr)
            words.append(word)

        inv_index = {}
        for i in range(len(definitions)):
            # enumerate the list of the whole documents and get the position and term for each word
            for term in definitions[i]:
                # if there exists a same index in the invented index, just supplement the items with the document for the same key
                if term in inv_index:
                    # if there exists a document for this index, just supplement the positions with the word in the document for the same key
                    if i in inv_index[term][1]:
                        inv_index[term][1][i] += 1
                    # otherwise, add this new document to the items for this index
                    else:
                        inv_index[term][0] += 1
                        inv_index[term][1][i] = 1
                # otherwise, add this new index into the keys of index dictionary with the document serial number, word position in the document
                else:
                    inv_index[term] = []
                    inv_index[term].append(1)
                    inv_index[term].append({})
                    inv_index[term][1][i] = 1

        return inv_index, words

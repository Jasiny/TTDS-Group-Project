import re

from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


class BOW():
    def __init__(self, stop_words=stopwords.words('english'), stemmer=PorterStemmer(), norm=True):
        '''
            stop_words: default using stopwords from nltk
            stemmer: default using PorterStemmer
            norm: default true, using l2 norm
        '''
        self.stop_words = self._preprocess_stop_words(stop_words)
        self.stemmer = stemmer
        self.norm = norm

    def preprocess(self, text):
        text = re.sub(r'[^a-z]', ' ', text.lower())
        words = text.split()
        if self.stop_words:
            words = [word for word in words if word not in self.stop_words]
        if self.stemmer:
            words = [self.stemmer.stem(word) for word in words]
        return ' '.join(words)

    def _preprocess_stop_words(self, stopwords):
        if stopwords:
            stopwords.remove('not')
            stopwords = [word for word in stopwords if "n't" not in word]
        return stopwords

    def get_training_samples(self, data_train):
        data = {}
        for word, defi_set in data_train.items():
            data[word] = ' '.join(defi_set)

        for word, defi_str in data.copy().items():
            data[word] = self.preprocess(defi_str)

        X = list(data.values())
        y = list(data.keys())
        return X, y

import pickle

from utils import *

data = load_data_from_json('data/data_with_augmented_examples.json', clean=True)
data_test = load_data_from_json('data/test_200.json')
data_train, data_seen_500, data_unseen_500 = split_seen_unseen(data)

with open('data/data.pkl', 'wb') as f:
    pickle.dump(data, f)

with open('data/data_test.pkl', 'wb') as f:
    pickle.dump(data_test, f)

with open('data/data_train.pkl', 'wb') as f:
    pickle.dump(data_train, f)

with open('data/data_seen_500.pkl', 'wb') as f:
    pickle.dump(data_seen_500, f)

with open('data/data_unseen_500.pkl', 'wb') as f:
    pickle.dump(data_unseen_500, f)

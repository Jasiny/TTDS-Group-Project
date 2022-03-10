# All deprecated functions that will not be used any more.
# You don't have to go through this file.

import json
import re
import time

import pandas as pd
import requests
from deprecated import deprecated
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer as Lemmatizer
from tqdm import tqdm


@deprecated
def _back_translate_from_google_api(text):
    '''
    [Deprecated] Back translation from Google Translation.
    '''
    url = 'https://translation.googleapis.com/language/translate/v2'
    params = {'key': 'do not use this key'}

    # to Chinese
    params['q'] = text
    params['source'] = 'en'
    params['target'] = 'zh'
    res_zh = requests.post(url, data=params)
    if res_zh.status_code == 200:
        text_zh = res_zh.json()['data']['translations'][0]['translatedText']
    elif res_zh.status_code == 403:
        time.sleep(60)
        return _back_translate_from_google_api(text)
    else:
        return ''

    # back to English
    params['q'] = text_zh
    params['source'] = 'zh'
    params['target'] = 'en'
    res_en = requests.post(url, data=params)
    if res_en.status_code == 200:
        text_en = res_en.json()['data']['translations'][0]['translatedText']
    elif res_en.status_code == 403:
        time.sleep(60)
        return _back_translate_from_google_api(text)
    else:
        return ''

    return text_en


@deprecated
def _request_definitions_from_oed_api(words):
    '''
    [Deprecated] Request definitions of words from Oxford English Dictionary.
    '''
    app_id = 'do not use this id'
    app_key = 'do not use this key'

    num_404 = 0
    data_oed = []

    for word in tqdm(words):
        url = f'https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/{word}'
        r = requests.get(url, headers={'app_id': app_id, 'app_key': app_key})
        if r.status_code == 200:
            defi_set, sent_set = _parse_oed_res(r.json())
            data_oed.append({
                'word': word,
                'definitions': list(defi_set),
                'examples': list(sent_set),
            })
        else:
            num_404 += 1

    print(num_404)

    with open('data/data_oed.json', 'w') as f:
        json.dump(data_oed, f, indent=4)


@deprecated
def _parse_oed_res(r):
    '''
    [Deprecated] Get definitions and example sentences from the response of API request.
    '''
    defi_set = set()
    sent_set = set()
    for i in r['results']:
        for result in i['lexicalEntries']:
            for j in result['entries']:
                senses = j['senses']
                for sense in senses:
                    # definition and examples of current word
                    if 'definitions' in sense:
                        for defi in sense['definitions']:
                            defi_set.add(defi)
                    if 'examples' in sense:
                        for example in sense['examples']:
                            sent_set.add(example['text'])
                    # short definition of current word
                    if 'shortDefinitions' in sense:
                        for short_defi in sense['shortDefinitions']:
                            defi_set.add(short_defi)
                    # definition and examples of subsense
                    if 'subsenses' in sense:
                        for subsense in sense['subsenses']:
                            if 'definitions' in subsense:
                                for sub_defi in subsense['definitions']:
                                    defi_set.add(sub_defi)
                            if 'examples' in subsense:
                                for sub_example in subsense['examples']:
                                    sent_set.add(sub_example['text'])
                            if 'shortDefinitions' in subsense:
                                for short_sub_defi in subsense['shortDefinitions']:
                                    defi_set.add(short_sub_defi)
    return defi_set, sent_set


@deprecated
def _words_to_aug(data, num=None):
    '''
    [Deprecated] Find which words need to be augmented.
    '''
    words = []
    if num == None:
        words = data.keys()
    else:
        # frequent words, from https://www.kaggle.com/rtatman/english-word-frequency
        df = pd.read_csv('data/freq.csv', keep_default_na=False).word.to_list()
        freq_words = []
        for word in df:
            word = word.lower()
            word = Lemmatizer().lemmatize(word)
            word = word.translate(str.maketrans(' -', '__'))
            freq_words.append(word)
        # stop words
        stop_words = stopwords.words('english')
        words = set(data.keys()).intersection(set(freq_words[:num]).difference(stop_words))
    print(f'number of words to be augmented: {len(words)}')
    return words


@deprecated
def _add_new_data(data, word, defi):
    '''
    [Deprecated] Add new word-definition pair into dictionary.
    '''
    word = word.strip()
    defi = defi.strip()
    if word and defi:
        word = word.lower()
        word = Lemmatizer().lemmatize(word)
        word = word.translate(str.maketrans(' -', '__'))
        defi = defi.lower()
        # only choose single English word
        if not re.search(r'[^a-z_\']', word):
            data[word].add(defi)
    return data


@deprecated
def _save_data_to_json(fname, data, data_examples=None):
    '''
    [Deprecated] Save data dictionary into local file.
    '''
    json_arr = []
    for word in data.keys():
        examples = []
        if data_examples and word in data_examples:
            examples = data_examples[word]
        json_arr.append({
            'word': word,
            'definitions': list(data[word]),
            'examples': list(examples)
        })
    with open(fname, 'w') as f:
        json.dump(json_arr, f, indent=4)

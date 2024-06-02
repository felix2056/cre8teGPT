# npm install spacy
# pip install spacy gensim
# python -m spacy download en_core_web_sm

# nlpAnalyzer.py
import spacy

from gensim import corpora
from gensim.models.ldamodel import LdaModel
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

# Load the SpaCy model
nlp = spacy.load("en_core_web_sm")

def extract_entities(text):
    doc = nlp(text)
    entities = [(entity.text, entity.label_) for entity in doc.ents]
    return entities

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize stopwords and lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    # Tokenize, remove stopwords and lemmatize
    tokens = [lemmatizer.lemmatize(word) for word in word_tokenize(text.lower()) if word.isalpha() and word not in stop_words]
    return tokens

def identify_topics(texts, num_topics=5, num_words=5):
    processed_texts = [preprocess_text(text) for text in texts]
    dictionary = corpora.Dictionary(processed_texts)
    corpus = [dictionary.doc2bow(text) for text in processed_texts]

    lda_model = LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)

    topics = lda_model.print_topics(num_words=num_words)
    return topics

# Example usage for individual segment
def identify_topics_in_segment(segment):
    return identify_topics([segment])


# analyze.py
import sys
import json
from nlpAnalyzer import extract_entities, identify_topics_in_segment

def main(segment):
    entities = extract_entities(segment)
    topics = identify_topics_in_segment(segment)
    return {
        "entities": entities,
        "topics": topics
    }

if __name__ == "__main__":
    segment = sys.argv[1]
    result = main(segment)
    print(json.dumps(result))

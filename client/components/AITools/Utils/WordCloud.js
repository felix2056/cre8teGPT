import { useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';

const WordCloudEl = ({ transcript, width, height, showControls }) => {
    const [spiralType, setSpiralType] = useState('archimedean');
    const [withRotation, setWithRotation] = useState(false);

    const colors = ['#143059', '#2F6B9A', '#82a6c2'];

    const wordFreq = (text) => {
        const words = text.replace(/\./g, '').split(/\s/);
        const freqMap = {};

        for (const w of words) {
            if (!freqMap[w]) freqMap[w] = 0;
            freqMap[w] += 1;
        }

        const commonWords = [',', '?', 'i', 'me', 'he', 'his', 'he\'s', 'she', 'her', 'her\'s', 'you', 'yours', 'is', 'don\'t', 'out', 'and', 'the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'it', 'was', 'for', 'on', 'be', 'with', 'as', 'by', 'at', 'are', 'this', 'have', 'from', 'or', 'one', 'had', 'not', 'but', 'what', 'all', 'were', 'when', 'we', 'there', 'can', 'an', 'your', 'which', 'their', 'said', 'if', 'do', 'don\'t', 'will', 'each', 'how', 'them', 'then', 'many', 'some', 'so', 'these', 'would', 'into', 'has', 'more', 'two', 'see', 'could', 'no', 'make', 'than', 'been', 'its', 'now', 'my', 'made', 'did', 'us', 'over', 'down', 'only', 'way', 'find', 'use', 'may', 'water', 'long', 'little', 'very', 'after', 'words', 'called', 'just', 'where', 'most', 'know', 'name', 'between', 'through', 'back', 'much', 'before', 'any', 'same', 'show', 'try', 'such', 'take', 'help', 'turn', 'here', 'why', 'off', 'light', 'never', 'ever', 'old', 'give', 'keep', 'thought', 'let', 'live', 'again', 'air', 'also', 'point', 'end', 'put', 'home', 'read', 'hand', 'port', 'large', 'spell', 'add', 'even', 'land', 'here', 'must', 'big', 'high', 'ask', 'able', 'about', 'above', 'across', 'act', 'addition', 'adjustment', 'adult', 'advertisement', 'after', 'again', 'against', 'age', 'ago', 'agree', 'air', 'all', 'allow', 'almost', 'alone', 'along', 'already', 'also', 'always', 'am', 'among', 'amount', 'an', 'and', 'angle', 'angry', 'animal', 'another', 'answer', 'ant', 'any', 'appear', 'apple', 'are', 'area', 'arm', 'army', 'around', 'arrive', 'art', 'as', 'ask', 'at', 'attack', 'attention', 'automatic', 'awake', 'away', 'baby', 'back', 'bad', 'bag', 'ball', 'band', 'bank', 'base', 'basket', 'bath', 'be', 'bean', 'bear', 'beat', 'beauty', 'because', 'become', 'bed', 'bee', 'before', 'begin', 'behind', 'believe', 'bell', 'belong', 'below', 'beside', 'best', 'better', 'between', 'big', 'bird', 'birth', 'bit', 'bite', 'black', 'bleed', 'blind', 'block', 'blood', 'blow', 'blue', 'board', 'boat', 'body', 'bone', 'book', 'boot', 'born', 'both', 'bottom', 'bowl', 'box'];
        for (const word of commonWords) {
            delete freqMap[word];
            delete freqMap[word.toLowerCase()];
            delete freqMap[word.toUpperCase()];
            delete freqMap[word.charAt(0).toUpperCase() + word.slice(1)];
            
            if (!isNaN(word)) {
                delete freqMap[word];
            }
        }

        return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
    };

    const getRotationDegree = () => {
        const rand = Math.random();
        const degree = rand > 0.5 ? 60 : -60;
        return rand * degree;
    };

    const words = wordFreq(transcript);

    const fontScale = scaleLog({
        domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
        range: [10, 100],
    });
    const fontSizeSetter = (datum) => fontScale(datum.value);

    const fixedValueGenerator = () => 0.5;

    return (
        <>
            <div className="wordcloud">
                <Wordcloud
                    words={words}
                    width={width}
                    height={height}
                    fontSize={fontSizeSetter}
                    font={'Impact'}
                    padding={2}
                    spiral={spiralType}
                    rotate={withRotation ? getRotationDegree : 0}
                    random={fixedValueGenerator}
                >
                    {(cloudWords) =>
                        cloudWords.map((w, i) => (
                            <Text
                                key={w.text}
                                fill={colors[i % colors.length]}
                                textAnchor={'middle'}
                                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                                fontSize={w.size}
                                fontFamily={w.font}
                            >
                                {w.text}
                            </Text>
                        ))
                    }
                </Wordcloud>
                {showControls && (
                    <div>
                        <label>
                            Spiral type &nbsp;
                            <select
                                onChange={(e) => setSpiralType(e.target.value)}
                                value={spiralType}
                            >
                                <option key={'archimedean'} value={'archimedean'}>
                                    archimedean
                                </option>
                                <option key={'rectangular'} value={'rectangular'}>
                                    rectangular
                                </option>
                            </select>
                        </label>
                        <label>
                            With rotation &nbsp;
                            <input
                                type="checkbox"
                                checked={withRotation}
                                onChange={() => setWithRotation(!withRotation)}
                            />
                        </label>
                        <br />
                    </div>
                )}
                <style jsx>{`
                    .wordcloud {
                    display: flex;
                    flex-direction: column;
                    user-select: none;
                    }
                    .wordcloud svg {
                    margin: 1rem 0;
                    cursor: pointer;
                    }
                    .wordcloud label {
                    display: inline-flex;
                    align-items: center;
                    font-size: 14px;
                    margin-right: 8px;
                    }
                    .wordcloud textarea {
                    min-height: 100px;
                    }
                `}</style>
            </div>
        </>
    );
};

export default WordCloudEl;

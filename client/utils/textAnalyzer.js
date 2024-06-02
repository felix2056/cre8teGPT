const { spawn } = require('child_process');

async function analyzeSegment(segment) {
    return new Promise((resolve, reject) => {
        const process = spawn('python', ['analyze.py', segment]);

        process.stdout.on('data', (data) => {
            resolve(JSON.parse(data.toString()));
        });

        process.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

async function analyzeSegments(segments) {
    const results = await Promise.all(segments.map(async (segment) => {
        const analysis = await analyzeSegment(segment);
        return {
            text: segment,
            entities: analysis.entities,
            topics: analysis.topics
        };
    }));
    return results;
}

module.exports = { analyzeSegments };

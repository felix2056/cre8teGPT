import * as tf from '@tensorflow/tfjs';

function cosineSimilarity(vecA, vecB) {
    const dotProduct = tf.tidy(() => tf.dot(vecA, vecB).arraySync());
    const normA = tf.tidy(() => tf.norm(vecA).arraySync());
    const normB = tf.tidy(() => tf.norm(vecB).arraySync());
    return dotProduct / (normA * normB);
}

export { cosineSimilarity };

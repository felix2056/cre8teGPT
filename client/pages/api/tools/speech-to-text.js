import fs from "fs";
import path from "path";
import * as formidable from 'formidable';

import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

// public/audio/user_id/[speech.mp3]
const audioDir = path.join(process.cwd(), 'public', 'audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

export const config = {
    api: {
        bodyParser: false, // Disable default bodyParser to handle file uploads
    },
};

export default async function handler(req, res) {
    // get user_id from req
    const user_id = req.headers['x-user-id'];

    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!fs.existsSync(path.join(audioDir, user_id))) {
        fs.mkdirSync(path.join(audioDir, user_id), { recursive: true });
    }

    if (req.method === "POST") {
        const form = new formidable.IncomingForm();
        // upload as mp3
        form.uploadDir = path.join(audioDir, user_id);
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error parsing the form.' });
            }

            // console.log(files);
            // return res.status(500).json({ message: 'File uploaded.', file: files.audio?.[0]?.filepath });

            const file = files.audio?.[0];

            const filePath = file?.filepath || file?.path;
            if (!filePath) {
                return res.status(400).json({ error: 'No audio file uploaded.' });
            }

            const fileSize = file?.size;
            if (fileSize > 10 * 1024 * 1024) {
                return res.status(400).json({ error: 'Audio file size must be less than 10MB.' });
            }

            // rename the file to speech.mp3
            const newFilePath = path.join(form.uploadDir, 'speech.mp3');
            fs.renameSync(filePath, newFilePath);
        });

        // form.on('fileBegin', (name, file) => {
        //     file.path = path.join(form.uploadDir, 'speech.mp3');
        // });

        form.on('file', async (name, file) => {
            console.log('Uploaded file', file.filepath);
        });

        form.on('error', (err) => {
            console.error('Error parsing the form', err);
            return res.status(500).json({ error: 'Error parsing the form.' });
        });

        form.on('end', async () => {
            const filePath = path.join(form.uploadDir, 'speech.mp3');
            
            try {
                console.log("filePath", filePath);

                const transcription = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(filePath),
                    model: "whisper-1",
                    response_format: 'json',
                    // language: fields.language || 'en'
                });
    
                res.status(200).json({ transcription: transcription.text });
            } catch (error) {
                res.status(500).json({ error: error.message });
            } finally {
                fs.unlinkSync(filePath);
            }
        });
        
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
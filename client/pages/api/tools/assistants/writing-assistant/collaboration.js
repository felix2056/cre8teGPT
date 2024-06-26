const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env?.TIPTAP_COLLAB_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const jwt = await jsonwebtoken.sign(
      {
        /* object to be encoded in the JWT */
      },
      JWT_SECRET,
    );

    return res.status(200).json({ token: jwt });
  }
}

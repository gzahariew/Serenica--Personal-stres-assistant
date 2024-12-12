import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const app = express();
const port = process.env.port;

// Middleware
app.use(cors());
app.use(express.json());

// Authenticate Firebase Token Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).send('No token provided');

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

// Example Endpoint
app.get('/getUserData', authenticate, (req, res) => {
  const uid = req.user.uid;
  res.status(200).json({ message: 'Data fetched successfully', uid });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


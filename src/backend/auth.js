import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; // Change this in production!
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'workwise';

// Helper to get collection
async function getCollection(collection) {
  const client = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true });
  const db = client.db(DB_NAME);
  return { col: db.collection(collection), client };
}

// Candidate Signup
router.post('/candidate/signup', async (req, res) => {
  const { email, password, ...profile } = req.body;
  const { col, client } = await getCollection('candidates');
  try {
    const existing = await col.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await col.insertOne({ email, password: hash, ...profile });
    res.status(201).json({ message: 'Signup successful.' });
  } finally { client.close(); }
});

// Candidate Login
router.post('/candidate/login', async (req, res) => {
  const { email, password } = req.body;
  const { col, client } = await getCollection('candidates');
  try {
    const user = await col.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User doesn\'t exist. Please sign up first.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } finally { client.close(); }
});

// Employer Signup
router.post('/employer/signup', async (req, res) => {
  const { email, password, ...profile } = req.body;
  const { col, client } = await getCollection('employers');
  try {
    const existing = await col.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await col.insertOne({ email, password: hash, ...profile });
    res.status(201).json({ message: 'Signup successful.' });
  } finally { client.close(); }
});

// Employer Login
router.post('/employer/login', async (req, res) => {
  const { email, password } = req.body;
  const { col, client } = await getCollection('employers');
  try {
    const user = await col.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User doesn\'t exist. Please sign up first.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } finally { client.close(); }
});

// Middleware to verify JWT
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Update Candidate Account Settings
router.put('/candidate/account-settings', authenticate, async (req, res) => {
  const { col, client } = await getCollection('candidates');
  try {
    await col.updateOne({ _id: new ObjectId(req.user.id) }, { $set: req.body });
    res.json({ message: 'Account updated.' });
  } finally { client.close(); }
});

// Update Employer Account Settings
router.put('/employer/account-settings', authenticate, async (req, res) => {
  const { col, client } = await getCollection('employers');
  try {
    await col.updateOne({ _id: new ObjectId(req.user.id) }, { $set: req.body });
    res.json({ message: 'Account updated.' });
  } finally { client.close(); }
});

export default router;

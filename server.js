import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    candidates: [
      {
        id: 1,
        name: 'John Doe',
        description: 'Experienced leader with focus on education',
        votes: 0,
        image: '/src/assets/react.svg'
      },
      {
        id: 2,
        name: 'Jane Smith',
        description: 'Innovative thinker for economic growth',
        votes: 0,
        image: '/src/assets/react.svg'
      }
    ],
    users: [],
    electionStatus: 'active'
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Helper function to read data
const readData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Routes

// GET /api/candidates
app.get('/api/candidates', (req, res) => {
  try {
    const data = readData();
    res.json(data.candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// POST /api/candidates
app.post('/api/candidates', (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const data = readData();
    const newId = data.candidates.length > 0 ? Math.max(...data.candidates.map(c => c.id)) + 1 : 1;
    const newCandidate = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      votes: 0,
      image: '/src/assets/react.svg'
    };

    data.candidates.push(newCandidate);
    writeData(data);

    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

// DELETE /api/candidates/:id
app.delete('/api/candidates/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readData();
    const index = data.candidates.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    data.candidates.splice(index, 1);
    writeData(data);

    res.json({ message: 'Candidate removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove candidate' });
  }
});

// POST /api/vote
app.post('/api/vote', (req, res) => {
  try {
    const { candidateId } = req.body;
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required' });
    }

    const data = readData();
    const candidate = data.candidates.find(c => c.id === candidateId);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    candidate.votes += 1;
    writeData(data);

    res.json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// GET /api/election-status
app.get('/api/election-status', (req, res) => {
  try {
    const data = readData();
    res.json({ status: data.electionStatus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch election status' });
  }
});

// POST /api/election-status
app.post('/api/election-status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['active', 'ended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const data = readData();
    data.electionStatus = status;
    writeData(data);

    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update election status' });
  }
});

// POST /api/signup
app.post('/api/signup', (req, res) => {
  try {
    const { name, aadhaar, password } = req.body;
    if (!name || !aadhaar || !password) {
      return res.status(400).json({ error: 'Name, Aadhaar, and password are required' });
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ error: 'Aadhaar must be exactly 12 digits' });
    }

    const data = readData();
    const existingUser = data.users.find(user => user.aadhaar === aadhaar);
    if (existingUser) {
      return res.status(400).json({ error: 'Aadhaar number already registered' });
    }

    const newUser = {
      id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      aadhaar,
      password, // In a real app, hash the password
      role: 'voter'
    };

    data.users.push(newUser);
    writeData(data);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
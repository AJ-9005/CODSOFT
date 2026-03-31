const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const multer = require('multer')
const path = require('path')

app.use(express.json());
app.use(cors());
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));

const DB_FILE = './db.json';

// --- HELPER FUNCTIONS ---
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        // Initial structure if file is missing or empty
        return { users: {}, jobs: [] };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'resumes/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage:storage })

// --- ROUTES ---

// 1. Initial Data Sync
app.get('/api/data', (req, res) => {
    const db = readDB();
    res.json(db);
});

// 2. Signup (Stores User as a Key in the Object)
app.post('/api/signup', upload.single('resume'), (req, res) => {
    const db = readDB();
    if (!req.body.userData) {
        return res.status(400).json({ message: "No user data received" });
    }
    const userData = JSON.parse(req.body.userData)

    if (db.users[userData.username]) {
        return res.status(400).json({ message: "Username already taken!" });
    }

    if(req.file){
        userData.details.resume = {
            name: req.file.originalname,
            url: `http://localhost:5000/resumes/${req.file.filename}`
        }
    }

    // Save using username as the Key
    db.users[userData.username] = userData;
    writeDB(db);
    
    res.status(201).json({ message: "User registered successfully!", user: userData });
});

// 3. Update Selection (Employer Approval/Rejection)
app.post('/api/update-selection', (req, res) => {
    const { username, selected } = req.body;
    const db = readDB();
    
    if (db.users[username]) {
        db.users[username].selected = selected;
        writeDB(db);
        return res.json({ message: "Selection updated!" });
    }
    
    res.status(404).json({ message: "User not found" });
});

// 4. Post a New Job
app.post('/api/add-job', (req, res) => {
    const newJob = req.body; 
    const db = readDB();

    db.jobs.push(newJob);
    writeDB(db);
    
    res.status(201).json({ message: "Job posted successfully!", job: newJob });
});

// 5. Apply to Job
app.post('/api/apply', (req, res) => {
    const { jobId, currentUser } = req.body; 
    const db = readDB();

    const jobIndex = db.jobs.findIndex(j => j.id == jobId);
    
    if (jobIndex !== -1) {
        // Prevent duplicate applications
        const alreadyApplied = db.jobs[jobIndex].applicants.some(a => a.username === currentUser.username);
        
        if (alreadyApplied) {
            return res.status(400).json({ message: "Already applied!" });
        }

        db.jobs[jobIndex].applicants.push(currentUser);
        writeDB(db);
        return res.json({ message: "Application submitted!" });
    }

    res.status(404).json({ message: "Job not found" });
});

// --- START SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 JSON Server running at http://localhost:${PORT}`);
    console.log(`📂 Database file: ${DB_FILE}`);
});
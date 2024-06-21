"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
const DB_PATH = path_1.default.join(__dirname, 'db.json');
// Helper function to read the database
const readDatabase = () => {
    if (!fs_1.default.existsSync(DB_PATH)) {
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify([]));
    }
    const dbFile = fs_1.default.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(dbFile);
};
// Helper function to write to the database
const writeDatabase = (data) => {
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};
// Endpoint to check server status
app.get('/ping', (req, res) => {
    res.json({ success: true });
});
// Endpoint to submit a new form
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const submissions = readDatabase();
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    submissions.push(newSubmission);
    writeDatabase(submissions);
    res.json({ success: true });
});
// Endpoint to read all submissions or a single submission by index
app.get('/read', (req, res) => {
    const { index } = req.query;
    const submissions = readDatabase();

    if (index !== undefined) {
        const submissionIndex = parseInt(index, 10);
        if (isNaN(submissionIndex) || submissionIndex < 0 || submissionIndex >= submissions.length) {
            return res.status(400).json({ error: 'Invalid index' });
        }
        return res.json([submissions[submissionIndex]]);
    }

    res.json(submissions);
});

// Endpoint to delete a submission by index
app.delete('/delete', (req, res) => {
    const { index } = req.query;
    const submissions = readDatabase();
    const submissionIndex = parseInt(index, 10);
    if (isNaN(submissionIndex) || submissionIndex < 0 || submissionIndex >= submissions.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }
    submissions.splice(submissionIndex, 1);
    writeDatabase(submissions);
    res.json({ success: true });
});
// Endpoint to edit a submission by index
app.put('/edit', (req, res) => {
    const { index } = req.query;
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const submissions = readDatabase();
    const submissionIndex = parseInt(index, 10);
    if (isNaN(submissionIndex) || submissionIndex < 0 || submissionIndex >= submissions.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }
    submissions[submissionIndex] = { name, email, phone, github_link, stopwatch_time };
    writeDatabase(submissions);
    res.json({ success: true });
});
// Endpoint to search submissions by email
app.get('/search', (req, res) => {
    const { email } = req.query;
    const submissions = readDatabase();
    const filteredSubmissions = submissions.filter((submission) => submission.email === email);
    if (filteredSubmissions.length === 0) {
        return res.status(404).json({ error: 'No submissions found for this email' });
    }
    res.json(filteredSubmissions);
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

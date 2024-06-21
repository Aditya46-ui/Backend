import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

// Helper function to read the database
const readDatabase = () => {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([]));
    }
    const dbFile = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(dbFile);
};

// Helper function to write to the database
const writeDatabase = (data: any) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Endpoint to check server status
app.get('/ping', (req: Request, res: Response) => {
    res.json({ success: true });
});

// Endpoint to submit a new form
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    const submissions = readDatabase();
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    submissions.push(newSubmission);

    writeDatabase(submissions);
    res.json({ success: true });
});

// Endpoint to read all submissions or a single submission by index
app.get('/read', (req: Request, res: Response) => {
    const { index } = req.query;
    const submissions = readDatabase();

    if (index !== undefined) {
        const submissionIndex = parseInt(index as string, 10);
        if (isNaN(submissionIndex) || submissionIndex < 0 || submissionIndex >= submissions.length) {
            return res.status(400).json({ error: 'Invalid index' });
        }
        return res.json([submissions[submissionIndex]]);
    }

    res.json(submissions);
});

// Endpoint to delete a submission by index
app.delete('/delete', (req: Request, res: Response) => {
    const { index } = req.query;

    const submissions = readDatabase();
    const submissionIndex = parseInt(index as string, 10);

    if (isNaN(submissionIndex) || submissionIndex < 0 || submissionIndex >= submissions.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    const deletedSubmission = submissions.splice(submissionIndex, 1);
    writeDatabase(submissions);
    res.json(deletedSubmission); // Return the deleted submission as a list
});

// Endpoint to edit a submission by index
app.put('/edit', (req: Request, res: Response) => {
    const { index } = req.query;
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    const submissions = readDatabase();
    const submissionIndex = parseInt(index as string, 10);

    if (isNaN(submissionIndex) || submissionIndex < 0 || submissionIndex >= submissions.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    submissions[submissionIndex] = { name, email, phone, github_link, stopwatch_time };
    writeDatabase(submissions);
    res.json([submissions[submissionIndex]]); // Return the edited submission as a list
});

// Endpoint to search submissions by email
app.get('/search', (req: Request, res: Response) => {
    const { email } = req.query;

    const submissions = readDatabase();
    const filteredSubmissions = submissions.filter((submission: any) => submission.email === email);

    if (filteredSubmissions.length === 0) {
        return res.status(404).json({ error: 'No submissions found for this email' });
    }

    res.json(filteredSubmissions);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



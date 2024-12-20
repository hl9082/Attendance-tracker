const express = require('express');
const neo4j = require('neo4j-driver');
const app = express();
const port = 5000;

const driver = neo4j.driver(
    'bolt://localhost:7687', // or your Neo4j server address
    neo4j.auth.basic('neo4j', 'password')
);
const session = driver.session();

app.use(express.json());

app.post('/attendance', async (req, res) => {
    const { userId, time } = req.body;
    try {
        await session.run(
            'CREATE (a:Attendance {userId: $userId, time: $time})',
            { userId, time }
        );
        res.status(201).send('Attendance Recorded');
    } catch (error) {
        res.status(500).send('Error recording attendance');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
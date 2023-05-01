const express = require('express');

const os = require('os');

const cluster = require('cluster');

// get number of cpus
const cpus = os.cpus().length;

const PORT = process.env.PORT || 5500;


if (cluster.isPrimary) {
    for (let i = 0; i < cpus; i++) {
        cluster.fork(); // this method will make copy of our application
    }

    // fault tolerant
    cluster.on('exit', () => {
        cluster.fork()
    })
} else {
    const app = express()
    app.get('/', async (req, res) => {
        let result = 0;
    
        // mocking some cpu intensive work
        for (let i = 0; i < 10000; i++) {
            result += i;
        }
        return res.json({
            processId: process.pid,
            result
        });
    });
    
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT} and PID: ${process.pid}`);
    })
}
const cluster = require('cluster');
const net = require('net');
const numCPUs = require('os').cpus().length;
const process = require('process');

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} started`)
    })

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork()
    });

} else {
    const tcpServer = net.createServer().on("connection", (socket) => {
        setTimeout(() => {
            socket.end('Request handled by worker-' + process.pid);
        }, 100);
    }).listen(8080)
}
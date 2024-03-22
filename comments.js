//Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 8080;

const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;
    const method = req.method;
    if (path == '/comments' && method == 'GET') {
        fs.readFile(__dirname + '/comments.json', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else if (path == '/comments' && method == 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            fs.readFile(__dirname + '/comments.json', (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                } else {
                    let comments = JSON.parse(data);
                    let newComment = JSON.parse(body);
                    comments.push(newComment);
                    fs.writeFile(__dirname + '/comments.json', JSON.stringify(comments), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                        } else {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(newComment));
                        }
                    });
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.FRONTEND_PORT || 3000; 

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
    };
    
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>Erro 404: Arquivo não encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Erro interno do servidor: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor frontend rodando na porta ${PORT}`);
});
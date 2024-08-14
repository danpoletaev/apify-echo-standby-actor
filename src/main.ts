import http from 'http';
// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor } from 'apify';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

// A simple utility function to parse the request body.
const parseBody = async (req: http.IncomingMessage) => {
    return new Promise((resolve, reject) => {
        let body: Buffer[] = [];
        req
            .on('data', (chunk: Buffer) => {
                body.push(chunk);
            })
            .on('end', () => {
                resolve(Buffer.concat(body).toString());
            })
            .on('error', (err: unknown) => {
                reject(err);
            });
    });
};

// A simple HTTP server that responds with the request headers, method, body, and query parameters.
const server = http.createServer(async (req, res) => {
    const { headers, method, url } = req;
    const body = await parseBody(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        headers,
        method,
        body: body || undefined,
        queryParams: Object.fromEntries(new URLSearchParams(url?.split('?')[1] || '')),
    }));
});

// Listen on the Actor Standby port
server.listen(Actor.config.get('standbyPort'));

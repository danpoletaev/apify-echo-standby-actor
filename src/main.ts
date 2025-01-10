import http from 'http';
// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor, log } from 'apify';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();


// A simple HTTP server that responds with the request headers, method, body, and query parameters.
const server = http.createServer(async (req, res) => {
    const { url, headers } = req;

    log.info(`Request URL: ${url}`, { headers, method: req.method, url, req });

    if (url!.startsWith('/cookies/set')) {
        res.writeHead(301, { Location: '/cookies' });
        res.end();
        return;
    }

    if (url!.startsWith('/cookies')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: "Successfully reached destination",
        }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: "Default route",
    }));
});

// Listen on the Actor Standby port
server.listen(Actor.config.get('standbyPort'));

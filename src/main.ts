import http from 'http';
// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/)
import { Actor, log } from 'apify';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

log.info('ENV', Actor.getEnv());
log.info('Config', Actor.config);
log.info('RUN_ID', {runId: Actor.getEnv()?.actorRunId});
log.info('RUN_ID_ENV:', {runId: process?.env?.ACTOR_RUN_ID});

// A simple HTTP server that responds with the request headers, method, body, and query parameters.
const server = http.createServer(async (req, res) => {
    const { url, headers } = req;

    log.info(`Request URL: ${url}`, { headers, method: req.method, url, req });
    // @ts-expect-error - token is not defined in the Request type
    log.info(`Request ID:`, { token: req?.token });

    if (url!.startsWith('/cookies/set')) {
        res.writeHead(301, { Location: '/cookies' });
        res.end();
        return;
    }

    if (url!.startsWith('/query-redirect')) {
        res.writeHead(301, { Location: '/cookies?query=value' });
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

    if (url!.startsWith('/outside-redirect')) {
        res.writeHead(301, { Location: 'https://www.google.com/' });
        res.end();
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: "Default route",
    }));
});

// Listen on the Actor Standby port
server.listen(Actor.config.get('standbyPort'));

import express from "express";

const app = express();
export default app;

const stats = {
    requestTimestamps: [],
    activeIPs: new Map(),
};

app.use((req, res, next) => {
    const start = Date.now();
    const clientIP =
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.headers["cf-connecting-ip"] ||
        req.socket.remoteAddress ||
        req.ip ||
        "unknown";

    stats.requestTimestamps.push(Date.now());

    stats.activeIPs.set(clientIP, Date.now());

    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(
            `${req.method} ${req.originalUrl.slice(0, 40)} - ${
                res.statusCode
            } (${ms}ms)`,
        );
    });

    next();
});

setInterval(() => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const sixtySecondsAgo = now - 60000;

    stats.requestTimestamps = stats.requestTimestamps.filter(
        (ts) => ts > oneMinuteAgo,
    );

    // Keep only IPs seen in the last 60 seconds
    for (const [ip, timestamp] of stats.activeIPs.entries()) {
        if (timestamp < sixtySecondsAgo) {
            stats.activeIPs.delete(ip);
        }
    }
}, 10000);

app.get("/api/stats", (req, res) => {
    const rpm = stats.requestTimestamps.length;
    const activeUsers = stats.activeIPs.size;
    res.json({ rpm, activeUsers });
});

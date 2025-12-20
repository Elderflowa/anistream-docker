import express from "express";
import path from "path";

const app = express();
export default app;

const ROOT = process.cwd();

app.get("/", (_, res) => {
    res.sendFile(path.join(ROOT, "public", "index.html"));
});

app.get("/logo.png", (_, res) => {
    res.sendFile(path.join(ROOT, "public", "logo.png"));
});

app.get(
    [
        "/:anilistToken/configure",
        "/:anilistToken/configure.json",
        "/configure",
        "/configure.json",
    ],
    (_, res) => {
        res.sendFile(path.join(ROOT, "public", "configure.html"));
    },
);

app.get(["/:anilistToken/manifest.json", "/manifest.json"], (_, res) => {
    res.setHeader("Cache-Control", "max-age=604800");
    res.setHeader("Content-Type", "application/json");
    res.sendFile(path.join(ROOT, "public", "manifest.json"));
});

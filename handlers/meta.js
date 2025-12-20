import { getAnimeDetails } from "../core/anilist.js";
import express from "express";

const app = express();
export default app;

app.get("/:anilistToken/meta/:type/:id.json", async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await getAnimeDetails(id);
        res.json({ meta });
    } catch (err) {
        console.log("Meta error:", err);
        res.json({ meta: {} });
    }
});

app.get("/meta/:type/:id.json", async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await getAnimeDetails(id);
        res.json({ meta });
    } catch (err) {
        console.log("Meta error:", err);
        res.json({ meta: {} });
    }
});

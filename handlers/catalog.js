import {
    searchAnime,
    getPlanningAnime,
    getWatchingAnime,
} from "../core/anilist.js";
import express from "express";

const app = express();
export default app;

app.get("/catalog/:type/:id.json", async (req, res) => {
    try {
        const { id } = req.params;

        if (id === "anilist_planning") {
            return res.json({ metas: [] });
        } else if (id === "anilist_watching") {
            return res.json({ metas: [] });
        }
    } catch (err) {
        console.log("Catalog error:", err);
        res.json({ metas: [] });
    }
});

app.get("/:anilistToken/catalog/:type/:id.json", async (req, res) => {
    try {
        const { anilistToken, id } = req.params;

        if (!anilistToken) return res.json({ metas: [] });

        if (id === "anilist_planning" && anilistToken) {
            const planningAnime = await getPlanningAnime(anilistToken);
            return res.json({ metas: planningAnime });
        } else if (id === "anilist_watching" && anilistToken) {
            const watchingAnime = await getWatchingAnime(anilistToken);
            return res.json({ metas: watchingAnime });
        }
    } catch (err) {
        console.log("Catalog error:", err);
        res.json({ metas: [] });
    }
});

app.get("/:anilistToken/catalog/:type/:id/:extra.json", async (req, res) => {
    try {
        const { extra } = req.params;

        const searchQuery =
            extra && extra.startsWith("search=")
                ? decodeURIComponent(extra.split("=")[1])
                : "";
        const anime = await searchAnime(searchQuery);
        res.json({ metas: anime });
    } catch (err) {
        console.log("Catalog error:", err);
        res.json({ metas: [] });
    }
});

app.get("/catalog/:type/:id/:extra.json", async (req, res) => {
    try {
        const { extra } = req.params;

        const searchQuery =
            extra && extra.startsWith("search=")
                ? decodeURIComponent(extra.split("=")[1])
                : "";
        const anime = await searchAnime(searchQuery);
        res.json({ metas: anime });
    } catch (err) {
        console.log("Catalog error:", err);
        res.json({ metas: [] });
    }
});

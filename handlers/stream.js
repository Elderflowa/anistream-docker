import {
    getAnimeStreams,
    updateUserWatchStatusOnAnilist,
} from "../core/addon.js";
import express from "express";

const app = express();
export default app;

app.get("/:anilistToken/stream/:type/:id.json", async (req, res) => {
    try {
        const { anilistToken, id } = req.params;

        if (!id.startsWith("ani_")) return res.json({ streams: [] });

        const [_, animeId, title, episode] = id.split("_");

        const streams = await getAnimeStreams(animeId, title, episode);

        // Update user's watch status on Anilist
        if (anilistToken) {
            updateUserWatchStatusOnAnilist(
                anilistToken,
                animeId,
                episode,
                streams,
            );
        }

        res.json({ streams });
    } catch (err) {
        console.log("Stream error:", err);
        res.json({ streams: [] });
    }
});

app.get("/stream/:type/:id.json", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.startsWith("ani_")) return res.json({ streams: [] });

        const [_, animeId, title, episode] = id.split("_");

        const streams = await getAnimeStreams(animeId, title, episode);

        res.json({ streams });
    } catch (err) {
        console.log("Stream error:", err);
        res.json({ streams: [] });
    }
});

import { getAnimeByAnilistId, getSubtitles } from "../core/anicli.js";
import express from "express";

const app = express();
export default app;

app.get(
    "/:anilistToken/subtitles/:type/:id/filename=:filename.json",
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!id.startsWith("ani_")) return res.json({ subtitles: [] });

            const allAnimeId = await getAnimeByAnilistId(
                id.split("_")[1],
                id.split("_")[2],
            );
            const subtitles = await getSubtitles(
                allAnimeId.id,
                id.split("_")[3],
            );

            if (!subtitles) return res.json({ subtitles: [] });

            return res.json({
                subtitles: [
                    {
                        id: "eng",
                        lang: "English",
                        url: subtitles,
                    },
                ],
            });
        } catch (err) {
            console.log("Subtitles error:", err);
            return res.json({ subtitles: [] });
        }
    },
);

app.get("/subtitles/:type/:id/filename=:filename.json", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.startsWith("ani_")) return res.json({ subtitles: [] });

        const allAnimeId = await getAnimeByAnilistId(
            id.split("_")[1],
            id.split("_")[2],
        );
        const subtitles = await getSubtitles(allAnimeId.id, id.split("_")[3]);

        if (!subtitles) return res.json({ subtitles: [] });

        return res.json({
            subtitles: [
                {
                    id: "eng",
                    lang: "English",
                    url: subtitles,
                },
            ],
        });
    } catch (err) {
        console.log("Subtitles error", err);
        res.json({ subtitles: [] });
    }
});
app.get(
    "/:anilistToken/subtitles/:type/:id/filename=:filename.json",
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!id.startsWith("ani_")) return res.json({ subtitles: [] });

            const allAnimeId = await getAnimeByAnilistId(
                id.split("_")[1],
                id.split("_")[2],
            );
            const subtitles = await getSubtitles(
                allAnimeId.id,
                id.split("_")[3],
            );

            if (!subtitles) return res.json({ subtitles: [] });

            return res.json({
                subtitles: [
                    {
                        id: "eng",
                        lang: "English",
                        url: subtitles,
                    },
                ],
            });
        } catch (err) {
            console.log("Subtitles error:", err);
            return res.json({ subtitles: [] });
        }
    },
);

app.get("/subtitles/:type/:id/filename=:filename.json", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.startsWith("ani_")) return res.json({ subtitles: [] });

        const allAnimeId = await getAnimeByAnilistId(
            id.split("_")[1],
            id.split("_")[2],
        );
        const subtitles = await getSubtitles(allAnimeId.id, id.split("_")[3]);

        if (!subtitles) return res.json({ subtitles: [] });

        return res.json({
            subtitles: [
                {
                    id: "eng",
                    lang: "English",
                    url: subtitles,
                },
            ],
        });
    } catch (err) {
        console.log("Subtitles error", err);
        res.json({ subtitles: [] });
    }
});

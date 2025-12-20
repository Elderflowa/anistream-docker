import express from "express";
import sharp from "sharp";

const app = express();
export default app;

app.get("/poster/:id.png", async (req, res) => {
    try {
        const original = req.query.url;
        const status = req.query.status;
        const progress = parseInt(req.query.progress || 0);
        const episodes = parseInt(req.query.episodes || 0);
        const nextAirUnix = parseInt(req.query.nextAir || 0);

        const img = await fetch(original).then((r) => r.arrayBuffer());
        const posterBuffer = Buffer.from(img);
        let composite = sharp(posterBuffer);

        if (status === "RELEASING") {
            if (progress < episodes) {
                const newEpBadgeSvg = Buffer.from(`
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 80" fill="none">
            <rect x="0" y="10" width="200" height="60" rx="20" fill="#5953db"/>
            <text
              x="100"
              y="49%"
              dominant-baseline="middle"
              text-anchor="middle"
              fill="white"
              font-family="Arial, sans-serif"
              font-size="28"
              font-weight="bold">
              NEW EP OUT
            </text>
          </svg>
        `);
                composite = composite.composite([
                    {
                        input: await sharp(newEpBadgeSvg).png().toBuffer(),
                        gravity: "south",
                    },
                ]);
            } else {
                const now = Math.floor(Date.now() / 1000);
                const diffDays = Math.ceil((nextAirUnix - now) / 86400);

                if (diffDays > 0) {
                    const nextEpBadgeSvg = Buffer.from(`
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="60" viewBox="0 0 200 80" fill="none">
              <rect x="-10" y="10" width="220" height="60" rx="20" fill="#5953db"/>
              <text
                x="100"
                y="49%"
                dominant-baseline="middle"
                text-anchor="middle"
                fill="white"
                font-family="Arial, sans-serif"
                font-size="28"
                font-weight="bold">
                EP IN ${diffDays} DAYS
              </text>
            </svg>
          `);
                    composite = composite.composite([
                        {
                            input: await sharp(nextEpBadgeSvg).png().toBuffer(),
                            gravity: "south",
                        },
                    ]);
                }
            }
        }

        const buffer = await composite.png({ compressionLevel: 8 }).toBuffer();

        res.setHeader("Content-Type", "image/png");
        res.send(buffer);
    } catch (err) {
        console.log("[POSTER] Error:", err.message);
        res.json({ error: "Failed to generate poster" });
    }
});

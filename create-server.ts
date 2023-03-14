import http from "node:http";
import fs from "node:fs";

const createServer = async (targetVideoPath: string, port: number = 8080) => {
  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(targetVideoPath);
  } catch (e) {
    console.error(e);
    return false;
  }

  return new Promise<boolean>((resolve) => {
    http
      .createServer((req, res) => {
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          const chunkSize = end - start + 1;
          const file = fs.createReadStream(targetVideoPath, { start, end });

          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
          });

          file.pipe(res);
        } else {
          const file = fs.createReadStream(targetVideoPath);

          res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
          });

          file.pipe(res);
        }
      })
      .listen(port)
      .once("listening", () => resolve(true))
      .once("error", (errMsg) => {
        console.error(errMsg);
        resolve(false);
      });
  });
};

export default createServer;

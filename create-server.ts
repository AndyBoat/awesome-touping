import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const WEB_DIST = path.resolve(__dirname, "./web/dist");

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
        if (req.url === "/awesome.mp4") {
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
        } else if (req.url?.startsWith("/awesome")) {
          if (req.url === "/awesome") {
            fs.readFile(
              path.resolve(WEB_DIST, "index.html"),
              function (err, data) {
                if (err) {
                  res.statusCode = 500;
                  res.end(`Error getting the file: ${err}.`);
                } else {
                  // if the file is found, set Content-type and send data
                  res.setHeader("Content-type", "text/html");
                  res.end(data);
                }
              }
            );
            return;
          }
          const pathname = req.url.replace("/awesome", "");
          // based on the URL path, extract the file extension. e.g. .js, .doc, ...
          const ext = path.parse(pathname).ext;
          // maps file extension to MIME typere
          const map = {
            ".ico": "image/x-icon",
            ".html": "text/html",
            ".js": "text/javascript",
            ".json": "application/json",
            ".css": "text/css",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".wav": "audio/wav",
            ".mp3": "audio/mpeg",
            ".svg": "image/svg+xml",
            ".pdf": "application/pdf",
            ".doc": "application/msword",
          };

          const filePath = path.join(WEB_DIST, pathname);
          const isExist = fs.existsSync(filePath);
          if (!isExist) {
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
          }
          // read file from file system
          fs.readFile(filePath, function (err, data) {
            if (err) {
              res.statusCode = 500;
              res.end(`Error getting the file: ${err}.`);
            } else {
              // if the file is found, set Content-type and send data
              res.setHeader("Content-type", (map as any)[ext] || "text/plain");
              res.end(data);
            }
          });
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

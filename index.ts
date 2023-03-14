import createServer from "./create-server";
import { exec } from "node:child_process";
import os from "node:os";
import yargs from "yargs";

const startServe = async (filePath: string) => {
  const localIpInternal: string = (() => {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
      const ifaceDetail = interfaces[iface]!.find(
        (ifaceDetails) =>
          ifaceDetails.family === "IPv4" && !ifaceDetails.internal
      );
      if (ifaceDetail) {
        return ifaceDetail.address;
      }
    }
    return "127.0.0.1";
  })();

  // (async () => {
  const port = 8080;
  const createRes = await createServer(filePath, port);
  if (createRes) {
    const targetUrl = `http://${localIpInternal}:${port}/awesome.mp4`;
    console.info(">>>targetUrl", targetUrl);
    exec(`open -a Safari ${targetUrl}`);
  }
  // })();
};

const argv = yargs
  .command(
    "serve [file]",
    "serve local video file with an accessible url for AirPlay across devices"
  )
  .help()
  .alias("help", "h").argv;

const { file: filePath } = argv as any;
console.info(filePath);
startServe(filePath);

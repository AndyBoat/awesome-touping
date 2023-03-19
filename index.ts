import createServer from "./create-server";
import { exec } from "node:child_process";
import os from "node:os";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const startServe = async (filePath: string, port: number) => {
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
  const createRes = await createServer(filePath, port);
  if (createRes) {
    const targetUrl = `http://${localIpInternal}:${port}/awesome.mp4`;
    const command = `open -a /Applications/Safari.app ${targetUrl}`;
    console.info("local url: ", targetUrl);
    console.info(
      `Awesome Touping should open a Safari tab with the url above. If it failed, you can open it manually by :\n${command}`
    );
    exec(`open -a /Applications/Safari.app ${targetUrl}`);
  }
  // })();
};

const argv = yargs
  .scriptName("awesome-touping")
  .command(
    "serve <path>",
    "serve local video file with an accessible url in local area network on MacOS. Mp4 only now.",
    (yargs) => {
      yargs.positional("path", {
        describe: "local video file path",
        type: "string",
      });
    }
  )
  .option("port", {
    alias: "p",
    type: "number",
    default: 9527,
    description: "Local port to serve from",
  })
  .demandCommand(1, "You need at least one command before moving on")
  .example([
    ["$0 serve example.mp4", "Serve the example.mp4"],
    [
      "$0 serve example.mp4 -p 3000",
      "Serve the example.mp4 from local port 3000",
    ],
  ])
  .alias("help", "h").argv;

const { path: filePath, port } = argv as any;
// console.info({ filePath, port });
startServe(filePath, port);

import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const publicDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public",
);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function reply(response, status, body, headers = {}, method = "GET") {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  response.end(method === "HEAD" ? undefined : body);
}

export function createServer() {
  return createHttpServer(async (request, response) => {
    const method = request.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      reply(response, 405, "Method Not Allowed", { Allow: "GET, HEAD" }, method);
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url ?? "/", "http://localhost").pathname,
      );
    } catch {
      reply(response, 400, "Bad Request", {}, method);
      return;
    }

    if (pathname === "/health") {
      reply(
        response,
        200,
        JSON.stringify({ status: "ok", project: "fly" }),
        { "Content-Type": "application/json; charset=utf-8" },
        method,
      );
      return;
    }

    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    if (relativePath.includes("..") || relativePath.includes("\\")) {
      reply(response, 404, "Not Found", {}, method);
      return;
    }

    const filePath = path.resolve(publicDirectory, relativePath);
    if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
      reply(response, 404, "Not Found", {}, method);
      return;
    }

    try {
      const body = await readFile(filePath);
      const contentType = contentTypes[path.extname(filePath)] ?? "application/octet-stream";
      reply(response, 200, body, { "Content-Type": contentType }, method);
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "EISDIR") {
        reply(response, 404, "Not Found", {}, method);
        return;
      }
      reply(response, 500, "Internal Server Error", {}, method);
    }
  });
}

function start() {
  const server = createServer();
  const host = process.env.HOST || "127.0.0.1";
  const port = Number(process.env.PORT || 4173);

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error("PORT must be an integer between 0 and 65535.");
    process.exitCode = 1;
    return;
  }

  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === "object" && address ? address.port : port;
    console.log(`Fly is running at http://${host}:${actualPort}`);
  });

  server.on("error", (error) => {
    console.error(`Could not start the server: ${error.message}`);
    process.exitCode = 1;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  start();
}

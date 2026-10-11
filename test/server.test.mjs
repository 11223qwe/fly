import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createServer } from "../src/server.mjs";

describe("Fly HTTP server", () => {
  let server;
  let baseUrl;

  before(async () => {
    server = createServer();
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    if (!server?.listening) return;
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("serves the starter page", async () => {
    const response = await fetch(baseUrl);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(html, /A small place/);
  });

  it("returns a successful health response", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok", project: "fly" });
  });

  it("serves browser assets", async () => {
    const response = await fetch(`${baseUrl}/app.js`);

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /javascript/);
    assert.match(await response.text(), /checkHealth/);
  });

  it("returns 404 for unknown paths and traversal attempts", async () => {
    const unknown = await fetch(`${baseUrl}/missing`);
    const traversal = await fetch(`${baseUrl}/..%2Fsrc%2Fserver.mjs`);

    assert.equal(unknown.status, 404);
    assert.equal(traversal.status, 404);
  });

  it("rejects unsupported HTTP methods", async () => {
    const response = await fetch(baseUrl, { method: "POST" });

    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET, HEAD");
  });
});

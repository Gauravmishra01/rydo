const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("Basic server", () => {
  test("GET / responds with Hello World", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/hello world/i);
  }, 10000);

  afterAll(async () => {
    try {
      await mongoose.disconnect();
    } catch (e) {
      // ignore
    }
  });
});

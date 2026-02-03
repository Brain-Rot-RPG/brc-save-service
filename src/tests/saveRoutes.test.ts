import request from "supertest";
import app from "../app";
import pool from "../db/db";

jest.mock("../db/db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn(),
  },
}));

const mockPool = pool as unknown as { query: jest.Mock };

describe("save routes", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  beforeEach(() => {
    mockPool.query.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("GET /api/v1/save returns all saves", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          realizedDungeons: [1, 2],
          currentDungeonId: 3,
          currentFightId: 5,
          playerId: 1,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).get("/api/v1/save");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        realizedDungeons: [1, 2],
        currentDungeonId: 3,
        currentFightId: 5,
        playerId: 1,
      },
    ]);
    expect(mockPool.query).toHaveBeenCalledWith("SELECT * FROM saves");
  });

  it("GET /api/v1/save/:id returns a save", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          realizedDungeons: [1],
          currentDungeonId: 2,
          currentFightId: 3,
          playerId: 1,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).get("/api/v1/save/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      realizedDungeons: [1],
      currentDungeonId: 2,
      currentFightId: 3,
      playerId: 1,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      "SELECT * FROM saves WHERE id = $1",
      [1]
    );
  });

  it("GET /api/v1/save/:id returns 404 when not found", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).get("/api/v1/save/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Save not found" });
  });

  it("POST /api/v1/save creates a save", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 2,
          realizedDungeons: [1, 2],
          currentDungeonId: 3,
          currentFightId: 5,
          playerId: 2,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).post("/api/v1/save").send({
      realizedDungeons: [1, 2],
      currentDungeonId: 3,
      currentFightId: 5,
      playerId: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 2,
      realizedDungeons: [1, 2],
      currentDungeonId: 3,
      currentFightId: 5,
      playerId: 2,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      "INSERT INTO saves (realizedDungeons, currentDungeonId, currentFightId, playerId) VALUES ($1, $2, $3, $4) RETURNING *",
      [[1, 2], 3, 5, 2]
    );
  });

  it("PUT /api/v1/save/:id updates a save", async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          realizedDungeons: [1, 2, 3],
          currentDungeonId: 4,
          currentFightId: 10,
          playerId: 1,
        },
      ],
      rowCount: 1,
    });

    const response = await request(app).put("/api/v1/save/1").send({
      realizedDungeons: [1, 2, 3],
      currentDungeonId: 4,
      currentFightId: 10,
      playerId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      realizedDungeons: [1, 2, 3],
      currentDungeonId: 4,
      currentFightId: 10,
      playerId: 1,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      "UPDATE saves SET realizedDungeons = $1, currentDungeonId = $2, currentFightId = $3, playerId = $4 WHERE id = $5 RETURNING *",
      [[1, 2, 3], 4, 10, 1, 1]
    );
  });

  it("PUT /api/v1/save/:id returns 404 when not found", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).put("/api/v1/save/999").send({
      realizedDungeons: [1],
      currentDungeonId: 2,
      currentFightId: 3,
      playerId: 1,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Save not found" });
  });

  it("DELETE /api/v1/save/:id deletes a save", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });

    const response = await request(app).delete("/api/v1/save/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Save deleted successfully" });
    expect(mockPool.query).toHaveBeenCalledWith(
      "DELETE FROM saves WHERE id = $1 RETURNING *",
      [1]
    );
  });

  it("DELETE /api/v1/save/:id returns 404 when not found", async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).delete("/api/v1/save/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Save not found" });
  });

  it("GET /api/v1/save returns 500 on database error", async () => {
    mockPool.query.mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).get("/api/v1/save");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "DB error" });
  });
});

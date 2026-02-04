CREATE TABLE saves (
    id SERIAL PRIMARY KEY,
    realizedDungeons INTEGER[],
    currentDungeonId INTEGER,
    currentFightId INTEGER,
    playerId TEXT,
    userId TEXT
);
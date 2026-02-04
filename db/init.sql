CREATE TABLE saves (
    id SERIAL PRIMARY KEY,
    realizedDungeons TEXT[],
    currentDungeonId TEXT,
    currentFightId INTEGER,
    playerId TEXT
);
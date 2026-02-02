CREATE TABLE Save (
    id SERIAL PRIMARY KEY,
    realizedDungeons INTEGER[],
    currentDungeonId INTEGER,
    currentFightId INTEGER,
    playerId INTEGER
);
CREATE TABLE saves (
    id SERIAL PRIMARY KEY,
    realizedDungeons INTEGER[],
    currentDungeonId INTEGER,
    currentFightId INTEGER,
    playerId INTEGER,
    userId TEXT,
    playerPos TEXT DEFAULT 'start'
);
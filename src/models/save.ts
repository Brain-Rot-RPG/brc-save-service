export interface Save {
  id?: number;
  realizedDungeons: number[];
  currentDungeonId: number;
  currentFightId: number,
  playerId: number | string
  userId: number | string
  playerPos: string
}
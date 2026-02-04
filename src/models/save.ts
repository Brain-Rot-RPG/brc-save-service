export interface Save {
  id?: number;
  realizedDungeons: (number | string)[];
  currentDungeonId: number | string;
  currentFightId: number,
  playerId: number | string
}
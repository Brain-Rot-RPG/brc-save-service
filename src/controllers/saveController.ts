import { Request, Response, NextFunction } from 'express';
import { Save } from '../models/save.js';
import pool from '../db/db.js';

export const createSave = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { realizedDungeons, currentDungeonId, currentFightId, playerId, userId, playerPos } = req.body;
        const newSave: Save = { 
            realizedDungeons, 
            currentDungeonId, 
            currentFightId, 
            playerId, 
            userId,
            playerPos: playerPos || 'start'
        };
        const query = 'INSERT INTO saves (realizedDungeons, currentDungeonId, currentFightId, playerId, userId, playerPos) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [newSave.realizedDungeons, newSave.currentDungeonId, newSave.currentFightId, newSave.playerId, newSave.userId, newSave.playerPos];
    
        pool.query(query, values)
        .then((result) => {
            res.status(201).json(result.rows[0]);
        })
        .catch((error) => {
            next(error);
        });
    } catch (error) {
        next(error);
    }
};

export const getSaves = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = 'SELECT * FROM saves';
    pool.query(query)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const getSaveById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const query = 'SELECT * FROM saves WHERE id = $1';
    const values = [id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Save not found' });
          return;
        }
        res.json(result.rows[0]);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const updateSave = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { realizedDungeons, currentDungeonId, currentFightId, playerId, userId, playerPos } = req.body;
    const query = 'UPDATE saves SET realizedDungeons = $1, currentDungeonId = $2, currentFightId = $3, playerId = $4, userId = $5, playerPos = $6 WHERE id = $7 RETURNING *';
    const values = [realizedDungeons, currentDungeonId, currentFightId, playerId, userId, playerPos || 'start', id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Save not found' });
          return;
        }
        res.json(result.rows[0]);
        })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const deleteSave = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const query = 'DELETE FROM saves WHERE id = $1 RETURNING *';
    const values = [id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Save not found' });
          return;
        }
        res.json({ message: 'Save deleted successfully' });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};
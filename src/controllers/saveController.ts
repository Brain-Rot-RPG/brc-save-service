import { Request, Response, NextFunction } from 'express';
import { Save } from '../models/save';
import pool from '../db/db';

export const createSave = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { realizedDungeons, currentDungeonId, currentFightId, playerId } = req.body;
        const newSave: Save = { id: Date.now(), realizedDungeons, currentDungeonId, currentFightId, playerId };
        const query = 'INSERT INTO saves (id, name, choice, check_function) VALUES ($1, $2, $3, $4)';
        const values = [newSave.id, newSave.realizedDungeons, newSave.currentDungeonId, newSave.currentFightId, newSave.playerId];
    
        pool.query(query, values)
        .then(() => {
            res.status(201).json(newSave);
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
    const { realizedDungeons, currentDungeonId, currentFightId,  playerId } = req.body;
    const query = 'UPDATE save SET realizzedDungeons = $1, currentDungeonId = $2, currentFightId = $3, playerId = $4 WHERE id = $5 RETURNING *';
    const values = [realizedDungeons, currentDungeonId, currentFightId, playerId, id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Battle not found' });
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
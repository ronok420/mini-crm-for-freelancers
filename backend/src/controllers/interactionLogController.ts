
import { Request, Response } from 'express';
import * as service from '../services/interactionLogService';
import { interactionLogSchema } from '../validators/interactionLogValidator';

export async function create(req: Request, res: Response) {
  const parsed = interactionLogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const log = await service.createLog(parsed.data);
  res.status(201).json(log);
}

export async function list(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const logs = await service.getLogsByUser(req.user.id);
  res.status(200).json(logs);
}

export async function getOne(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const log = await service.getLogById(req.user.id, req.params.id);
  if (!log) {
    res.status(404).json({ error: 'Interaction Log not found' });
    return;
  }

  res.status(200).json(log);
}

export async function update(req: Request, res: Response) {
  const parsed = interactionLogSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const updated = await service.updateLog(req.params.id, parsed.data);
  res.status(200).json(updated);
}

export async function remove(req: Request, res: Response) {
  const deleted = await service.deleteLog(req.params.id);
  res.status(204).send();
}

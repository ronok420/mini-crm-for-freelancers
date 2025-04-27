import { Request, Response } from 'express';
import * as service from '../services/reminderService';
import { reminderSchema } from '../validators/reminderValidator';

export async function create(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const parsed = reminderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const reminder = await service.createReminder(req.user.id, parsed.data);
  res.status(201).json(reminder);
}

export async function list(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const reminders = await service.getRemindersByUser(req.user.id);
  res.status(200).json(reminders);
}

export async function listThisWeek(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const reminders = await service.getRemindersThisWeek(req.user.id);
  res.status(200).json(reminders);
}

export async function getOne(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const reminder = await service.getReminderById(req.user.id, req.params.id);
  if (!reminder) {
    res.status(404).json({ error: 'Reminder not found' });
    return;
  }

  res.status(200).json(reminder);
}

export async function update(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const parsed = reminderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const updated = await service.updateReminder(req.user.id, req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Reminder not found' });
    return;
  }

  res.status(200).json(updated);
}

export async function remove(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const deleted = await service.deleteReminder(req.user.id, req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Reminder not found' });
    return;
  }

  res.status(204).send();
}

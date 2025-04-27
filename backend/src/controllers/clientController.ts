import { RequestHandler, Request, Response } from 'express';
import * as service from '../services/clientService';
import { clientSchema } from '../validators/clientValidator';
import { User } from '@supabase/supabase-js';


interface AuthRequest extends Request {
  user: User; // Non-optional user
}

export const create: RequestHandler = async (req, res) => {
  const { user } = req as AuthRequest;

  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const client = await service.createClient(user.id, parsed.data);
  res.status(201).json(client);
};

export const list: RequestHandler = async (req, res) => {
  const { user } = req as AuthRequest;

  const clients = await service.getClients(user.id);
  res.status(200).json(clients);
};

export const getOne: RequestHandler = async (req, res) => {
  const { user } = req as AuthRequest;

  const client = await service.getClientById(user.id, req.params.id);
  if (!client) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  res.status(200).json(client);
};

export const update: RequestHandler = async (req, res) => {
  const { user } = req as AuthRequest;

  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const updated = await service.updateClient(user.id, req.params.id, parsed.data);
  if (!updated.count) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  res.status(200).json({ message: 'Client updated successfully' });
};

export const remove: RequestHandler = async (req, res) => {
  const { user } = req as AuthRequest;

  const deleted = await service.deleteClient(user.id, req.params.id);
  if (!deleted.count) {
    res.status(404).json({ error: 'Client not found' });
    return;
  }

  res.status(204).send();
};

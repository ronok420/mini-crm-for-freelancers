
import { Request, Response } from 'express';
import * as service from '../services/projectService';
import { projectSchema } from '../validators/projectValidator';

export async function create(req: Request, res: Response) {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const project = await service.createProject(parsed.data);
  res.status(201).json(project);
}

export async function list(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const projects = await service.getProjectsByUser(req.user.id);
  res.status(200).json(projects);
}

export async function getOne(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const project = await service.getProjectById(req.user.id, req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.status(200).json(project);
}

export async function update(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const updated = await service.updateProject(req.user.id, req.params.id, parsed.data);
  if (!updated) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.status(200).json(updated);
}

export async function remove(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const deleted = await service.deleteProject(req.user.id, req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.status(204).send();
}

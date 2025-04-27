import { prisma } from '../lib/prisma';

export async function createProject(data: any) {
  return await prisma.project.create({
    data: {
      clientId: data.client_id,
      title: data.title,
      budget: data.budget,
      deadline: new Date(data.deadline),
      status: data.status,
    },
  });
}

export async function getProjectsByUser(userId: string) {
  return await prisma.project.findMany({
    where: {
      client: {
        userId: userId,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProjectById(userId: string, projectId: string) {
  return await prisma.project.findFirst({
    where: {
      id: projectId,
      client: {
        userId: userId,
      },
    },
  });
}

export async function updateProject(userId: string, projectId: string, data: any) {
  const project = await getProjectById(userId, projectId);
  if (!project) return null;

  return await prisma.project.update({
    where: { id: projectId },
    data: {
      title: data.title,
      budget: data.budget,
      deadline: new Date(data.deadline),
      status: data.status,
    },
  });
}

export async function deleteProject(userId: string, projectId: string) {
  const project = await getProjectById(userId, projectId);
  if (!project) return null;

  return await prisma.project.delete({
    where: { id: projectId },
  });
}

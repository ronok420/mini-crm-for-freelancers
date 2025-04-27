import { prisma } from '../lib/prisma';

export async function createLog(data: any) {
  return await prisma.interactionLog.create({
    data: {
      clientId: data.client_id || null,
      projectId: data.project_id || null,
      date: new Date(data.date),
      type: data.type,
      notes: data.notes,
    },
  });
}

export async function getLogsByUser(userId: string) {
  return await prisma.interactionLog.findMany({
    where: {
      OR: [
        { client: { userId } },
        { project: { client: { userId } } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getLogById(userId: string, logId: string) {
  return await prisma.interactionLog.findFirst({
    where: {
      id: logId,
      OR: [
        { client: { userId } },
        { project: { client: { userId } } },
      ],
    },
  });
}

export async function updateLog(logId: string, data: any) {
  return await prisma.interactionLog.update({
    where: { id: logId },
    data: {
      clientId: data.client_id || null,
      projectId: data.project_id || null,
      date: new Date(data.date),
      type: data.type,
      notes: data.notes,
    },
  });
}

export async function deleteLog(logId: string) {
  return await prisma.interactionLog.delete({
    where: { id: logId },
  });
}

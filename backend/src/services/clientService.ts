import { prisma } from '../lib/prisma';

export async function createClient(userId: string, data: any) {
  return await prisma.client.create({
    data: {
      userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      notes: data.notes,
    },
  });
}

export async function getClients(userId: string) {
  return await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getClientById(userId: string, clientId: string) {
  return await prisma.client.findFirst({
    where: { id: clientId, userId },
  });
}

export async function updateClient(userId: string, clientId: string, data: any) {
  return await prisma.client.updateMany({
    where: { id: clientId, userId },
    data,
  });
}

export async function deleteClient(userId: string, clientId: string) {
  return await prisma.client.deleteMany({
    where: { id: clientId, userId },
  });
}

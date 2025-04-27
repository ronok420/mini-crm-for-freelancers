import { prisma } from '../lib/prisma';

export async function createReminder(userId: string, data: any) {
  return await prisma.reminder.create({
    data: {
      userId,
      clientId: data.client_id || null,
      projectId: data.project_id || null,
      note: data.note,
      dueDate: new Date(data.due_date),
    },
  });
}

export async function getRemindersByUser(userId: string) {
  return await prisma.reminder.findMany({
    where: { userId },
    orderBy: { dueDate: 'asc' },
  });
}

export async function getReminderById(userId: string, reminderId: string) {
  return await prisma.reminder.findFirst({
    where: { id: reminderId, userId },
  });
}

export async function updateReminder(userId: string, reminderId: string, data: any) {
  const reminder = await getReminderById(userId, reminderId);
  if (!reminder) return null;

  return await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      clientId: data.client_id || null,
      projectId: data.project_id || null,
      note: data.note,
      dueDate: new Date(data.due_date),
    },
  });
}

export async function deleteReminder(userId: string, reminderId: string) {
  const reminder = await getReminderById(userId, reminderId);
  if (!reminder) return null;

  return await prisma.reminder.delete({
    where: { id: reminderId },
  });
}

export async function getRemindersThisWeek(userId: string) {
  const now = new Date();
  const endOfWeek = new Date();
  endOfWeek.setDate(now.getDate() + 7);

  return await prisma.reminder.findMany({
    where: {
      userId,
      dueDate: {
        gte: now,
        lte: endOfWeek,
      },
    },
    orderBy: { dueDate: 'asc' },
  });
}

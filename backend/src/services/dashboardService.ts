import { prisma } from '../lib/prisma';

export async function getDashboardSummary(userId: string) {
  // Total Clients
  const totalClients = await prisma.client.count({
    where: { userId },
  });

  // Fetch client IDs for the user
  const clientIds = await prisma.client.findMany({
    where: { userId },
    select: { id: true },
  });
  const clientIdList = clientIds.map((client) => client.id);

  // Total Projects
  const totalProjects = await prisma.project.count({
    where: { clientId: { in: clientIdList } },
  });

  // Reminders Due Soon (next 7 days)
  const now = new Date();
  const weekLater = new Date();
  weekLater.setDate(now.getDate() + 7);

  const remindersDue = await prisma.reminder.count({
    where: {
      userId,
      dueDate: {
        gte: now,
        lte: weekLater,
      },
    },
  });

  // Projects by Status
  const projects = await prisma.project.groupBy({
    by: ['status'],
    where: { clientId: { in: clientIdList } },
    _count: { _all: true },
  });

  const projectsByStatus = {
    planned: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  };

  projects.forEach((item) => {
    if (item.status in projectsByStatus) {
      projectsByStatus[item.status] = item._count._all;
    }
  });

  return {
    totalClients,
    totalProjects,
    remindersDue,
    projectsByStatus,
  };
}

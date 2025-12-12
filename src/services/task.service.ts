import { prisma } from "@/lib/db";
import type { TaskStatus } from "@prisma/client";
import type { CreateTaskInput } from "@/types";

export const TaskService = {
  async create(data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        leadId: data.leadId,
        title: data.title,
        deadline: data.deadline,
        status: "pending",
      },
      include: {
        lead: true,
      },
    });
  },

  async getTodaysTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.task.findMany({
      where: {
        lead: { userId },
        deadline: {
          gte: today,
          lt: tomorrow,
        },
        status: { not: "completed" },
      },
      include: { lead: true },
      orderBy: { deadline: "asc" },
    });
  },

  async getOverdueTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.task.findMany({
      where: {
        lead: { userId },
        deadline: { lt: today },
        status: { not: "completed" },
      },
      include: { lead: true },
      orderBy: { deadline: "asc" },
    });
  },

  async updateStatus(id: string, status: TaskStatus) {
    return prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: status === "completed" ? new Date() : null,
      },
    });
  },

  async getByLead(leadId: string) {
    return prisma.task.findMany({
      where: { leadId },
      orderBy: { deadline: "asc" },
    });
  },
};

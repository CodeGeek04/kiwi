import { prisma } from "@/lib/db";
import type { CreateLeadInput } from "@/types";

export const LeadService = {
  async create(data: CreateLeadInput) {
    return prisma.lead.create({
      data: {
        userId: data.userId,
        name: data.name,
        attributes: data.attributes || {},
      },
    });
  },

  async getAllByUser(userId: string) {
    return prisma.lead.findMany({
      where: { userId },
      include: {
        tasks: {
          orderBy: { deadline: "asc" },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  async getById(id: string, userId: string) {
    return prisma.lead.findFirst({
      where: { id, userId },
      include: {
        tasks: true,
        notes: true,
      },
    });
  },

  async findByName(name: string, userId: string) {
    return prisma.lead.findMany({
      where: {
        userId,
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  },

  async update(id: string, userId: string, data: { name?: string; attributes?: Record<string, unknown> }) {
    return prisma.lead.update({
      where: { id, userId },
      data,
    });
  },

  async delete(id: string, userId: string) {
    return prisma.lead.delete({
      where: { id, userId },
    });
  },
};

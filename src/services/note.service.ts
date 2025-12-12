import { prisma } from "@/lib/db";
import type { CreateNoteInput } from "@/types";

export const NoteService = {
  async create(data: CreateNoteInput) {
    return prisma.note.create({
      data: {
        leadId: data.leadId,
        content: data.content,
      },
      include: {
        lead: true,
      },
    });
  },

  async getByLead(leadId: string) {
    return prisma.note.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
  },

  async update(id: string, content: string) {
    return prisma.note.update({
      where: { id },
      data: { content },
    });
  },

  async delete(id: string) {
    return prisma.note.delete({
      where: { id },
    });
  },
};

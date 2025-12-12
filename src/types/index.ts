import type { Lead, Task, Note } from "@prisma/client";

export type LeadWithRelations = Lead & {
  tasks: Task[];
  notes: Note[];
};

export type TaskWithLead = Task & {
  lead: Lead;
};

export interface UserContext {
  leads: LeadWithRelations[];
  todaysTasks: TaskWithLead[];
  overdueTasks: TaskWithLead[];
}

export interface CreateLeadInput {
  userId: string;
  name: string;
  attributes?: Record<string, string | number | boolean | null>;
}

export interface CreateTaskInput {
  leadId: string;
  title: string;
  deadline: Date;
}

export interface CreateNoteInput {
  leadId: string;
  content: string;
}

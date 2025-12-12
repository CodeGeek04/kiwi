import { z } from "zod";
import { LeadService } from "@/services/lead.service";
import { TaskService } from "@/services/task.service";
import { NoteService } from "@/services/note.service";

// Define schemas separately for reuse
const addLeadSchema = z.object({
  name: z.string().describe("The name or title of the lead"),
  attributes: z
    .record(z.string(), z.any())
    .optional()
    .describe(
      "Additional attributes as key-value pairs (e.g., email, phone, company, source, etc.)"
    ),
});

const addTaskSchema = z.object({
  leadId: z.string().describe("The ID of the lead this task belongs to"),
  title: z.string().describe("The title or description of the task"),
  deadline: z
    .string()
    .describe(
      "The deadline for the task in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)"
    ),
});

const addNoteSchema = z.object({
  leadId: z.string().describe("The ID of the lead this note belongs to"),
  content: z.string().describe("The content of the note"),
});

const updateTaskStatusSchema = z.object({
  taskId: z.string().describe("The ID of the task to update"),
  status: z
    .enum(["pending", "in_progress", "completed"])
    .describe("The new status for the task: 'pending', 'in_progress', or 'completed'"),
});

export function createTools(userId: string) {
  return {
    addLead: {
      description:
        "Create a new lead in the CRM. A lead can be a person, company, project, or any entity the user wants to track. IMPORTANT: Before calling this tool, always check if a similar lead already exists and confirm with the user.",
      inputSchema: addLeadSchema,
      execute: async ({
        name,
        attributes,
      }: z.infer<typeof addLeadSchema>) => {
        try {
          const lead = await LeadService.create({
            userId,
            name,
            attributes: attributes || {},
          });
          return {
            success: true,
            lead: {
              id: lead.id,
              name: lead.name,
              attributes: lead.attributes,
            },
            message: `Lead "${name}" created successfully.`,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to create lead: ${error instanceof Error ? error.message : "Unknown error"}`,
          };
        }
      },
    },

    addTask: {
      description:
        "Add a task with a deadline to an existing lead. Use this to track follow-ups, meetings, calls, or any action items related to a lead.",
      inputSchema: addTaskSchema,
      execute: async ({
        leadId,
        title,
        deadline,
      }: z.infer<typeof addTaskSchema>) => {
        try {
          const task = await TaskService.create({
            leadId,
            title,
            deadline: new Date(deadline),
          });
          return {
            success: true,
            task: {
              id: task.id,
              title: task.title,
              deadline: task.deadline.toISOString(),
              status: task.status,
              leadName: task.lead.name,
            },
            message: `Task "${title}" added to "${task.lead.name}" with deadline ${deadline}.`,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`,
          };
        }
      },
    },

    addNote: {
      description:
        "Add a note to an existing lead. Use this to record important information, conversation summaries, meeting notes, or any relevant details about a lead.",
      inputSchema: addNoteSchema,
      execute: async ({
        leadId,
        content,
      }: z.infer<typeof addNoteSchema>) => {
        try {
          const note = await NoteService.create({
            leadId,
            content,
          });
          return {
            success: true,
            note: {
              id: note.id,
              content: note.content,
              leadName: note.lead.name,
            },
            message: `Note added to "${note.lead.name}".`,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to add note: ${error instanceof Error ? error.message : "Unknown error"}`,
          };
        }
      },
    },

    updateTaskStatus: {
      description:
        "Update the status of an existing task. Use this when the user says they completed a task, started working on something, or want to change a task's status. Status can be 'pending', 'in_progress', or 'completed'.",
      inputSchema: updateTaskStatusSchema,
      execute: async ({
        taskId,
        status,
      }: z.infer<typeof updateTaskStatusSchema>) => {
        try {
          const task = await TaskService.updateStatus(taskId, status);
          return {
            success: true,
            task: {
              id: task.id,
              title: task.title,
              status: task.status,
              completedAt: task.completedAt?.toISOString() || null,
            },
            message: `Task "${task.title}" marked as ${status.replace("_", " ")}.`,
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to update task status: ${error instanceof Error ? error.message : "Unknown error"}`,
          };
        }
      },
    },
  };
}

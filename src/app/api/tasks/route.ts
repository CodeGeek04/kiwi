import { UserService } from "@/services/user.service";
import { TaskService } from "@/services/task.service";
import { LeadService } from "@/services/lead.service";

export async function POST(req: Request) {
  try {
    const user = await UserService.getOrCreateUser();
    const { leadId, title, deadline } = await req.json();

    if (!leadId || !title || !deadline) {
      return Response.json({ error: "leadId, title, and deadline are required" }, { status: 400 });
    }

    // Verify the lead belongs to the user
    const lead = await LeadService.getById(leadId, user.id);
    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    const task = await TaskService.create({
      leadId,
      title,
      deadline: new Date(deadline),
    });

    return Response.json(task);
  } catch (error) {
    console.error("Create task error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}

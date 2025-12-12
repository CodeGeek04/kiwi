import { UserService } from "@/services/user.service";
import { NoteService } from "@/services/note.service";
import { LeadService } from "@/services/lead.service";

export async function POST(req: Request) {
  try {
    const user = await UserService.getOrCreateUser();
    const { leadId, content } = await req.json();

    if (!leadId || !content) {
      return Response.json({ error: "leadId and content are required" }, { status: 400 });
    }

    // Verify the lead belongs to the user
    const lead = await LeadService.getById(leadId, user.id);
    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    const note = await NoteService.create({
      leadId,
      content,
    });

    return Response.json(note);
  } catch (error) {
    console.error("Create note error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to create note" }, { status: 500 });
  }
}

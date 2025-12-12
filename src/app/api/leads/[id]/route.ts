import { UserService } from "@/services/user.service";
import { LeadService } from "@/services/lead.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await UserService.getOrCreateUser();
    const { id } = await params;
    const { name, attributes } = await req.json();

    const lead = await LeadService.update(id, user.id, { name, attributes });
    return Response.json(lead);
  } catch (error) {
    console.error("Update lead error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await UserService.getOrCreateUser();
    const { id } = await params;

    await LeadService.delete(id, user.id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete lead error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}

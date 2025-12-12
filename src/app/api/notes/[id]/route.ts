import { UserService } from "@/services/user.service";
import { NoteService } from "@/services/note.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await UserService.getOrCreateUser();
    const { id } = await params;
    const { content } = await req.json();

    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const note = await NoteService.update(id, content);
    return Response.json(note);
  } catch (error) {
    console.error("Update note error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await UserService.getOrCreateUser();
    const { id } = await params;

    await NoteService.delete(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

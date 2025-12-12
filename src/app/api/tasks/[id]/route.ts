import { UserService } from "@/services/user.service";
import { TaskService } from "@/services/task.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await UserService.getOrCreateUser();
    const { id } = await params;
    const { title, deadline, status } = await req.json();

    const task = await TaskService.update(id, {
      title,
      deadline: deadline ? new Date(deadline) : undefined,
      status,
    });

    return Response.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await UserService.getOrCreateUser();
    const { id } = await params;

    await TaskService.delete(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}

import { UserService } from "@/services/user.service";
import { LeadService } from "@/services/lead.service";

export async function POST(req: Request) {
  try {
    const user = await UserService.getOrCreateUser();
    const { name, attributes } = await req.json();

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const lead = await LeadService.create({
      userId: user.id,
      name,
      attributes,
    });

    return Response.json(lead);
  } catch (error) {
    console.error("Create lead error:", error);
    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }
    return Response.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

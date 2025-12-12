import { UserService } from "@/services/user.service";
import { getUserContext } from "@/services/context.service";

export async function GET() {
  try {
    const user = await UserService.getOrCreateUser();
    const context = await getUserContext(user.id);

    return Response.json({
      leads: context.leads,
      todaysTasks: context.todaysTasks,
      overdueTasks: context.overdueTasks,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response(
      `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}

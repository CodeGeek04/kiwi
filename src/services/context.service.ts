import { LeadService } from "./lead.service";
import { TaskService } from "./task.service";
import type { UserContext } from "@/types";

export async function getUserContext(userId: string): Promise<UserContext> {
  const [leads, todaysTasks, overdueTasks] = await Promise.all([
    LeadService.getAllByUser(userId),
    TaskService.getTodaysTasks(userId),
    TaskService.getOverdueTasks(userId),
  ]);

  return {
    leads,
    todaysTasks,
    overdueTasks,
  };
}

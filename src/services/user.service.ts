import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const UserService = {
  async getOrCreateUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      throw new Error("Not authenticated");
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new Error("User has no email address");
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email,
          name: clerkUser.fullName || clerkUser.firstName || null,
        },
      });

      // Create a default "Personal" lead for the new user
      await prisma.lead.create({
        data: {
          userId: user.id,
          name: "Personal",
          attributes: {
            description: "Default lead for personal tasks and reminders",
          },
        },
      });
    }

    return user;
  },

  async getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
    });
  },
};

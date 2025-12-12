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
    }

    return user;
  },

  async getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
    });
  },
};

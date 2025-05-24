"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function getMyUserDetail() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const userDetails = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    })

    if (!userDetails) {
        return null
    }

    return userDetails
}
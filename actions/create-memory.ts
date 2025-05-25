"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export const createMemory = async (data: {
    content: string;
    date: Date;
    location: string;
}) => {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const ship = await prisma.relationShip.findFirst({
        where: {
            users: {
                some: {
                    clerkId: userId,
                },
            }
        },
        include: {
            memories: true,
        }
    })

    if (!ship) {
        throw new Error("No relationship found for the user")
    }

    await prisma.memories.create({
        data: {
            content: data.content,
            date: data.date,
            location: data.location,
            relationShipId: ship.id,
        }
    })
}
"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function getMyRelationship() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const relationship = await prisma.relationShip.findFirst({
        where: {
            users: {
                some: {
                    clerkId: userId,
                },
            }
        },
        include: {
            users: {
                select: {
                    id: true,
                    clerkId: true,
                    avatar: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    relationShipCode: false,
                    createdAt: false,
                    updatedAt: false,
                }
            },
            memories: true,
        },
    })
    if (!relationship) {
        return null
    }

    return relationship
}

export async function getMyShipCode() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const userData = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
        select: {
            relationShipCode: true,
        },
    })
    if (!userData) {
        throw new Error("User data not found")
    }

    return userData.relationShipCode
}

export async function getMyShipMemories() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const relationship = await prisma.relationShip.findFirst({
        where: {
            users: {
                some: {
                    clerkId: userId,
                },
            }
        },
        select: {
            memories: true,
        },
    })
    if (!relationship) {
        return []
    }

    return relationship.memories
}
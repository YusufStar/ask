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

    const memory = await prisma.memories.findMany({
        where: {
            RelationShip: {
                users: {
                    some: {
                        clerkId: userId,
                    }
                }
            }
        },
        include: {
            RelationShip: {
                include: {
                    users: true,
                }
            },
            images: true,
        }
    })

    if (!memory) {
        throw new Error("Memory not found")
    }

    return memory
}

export async function getMemoryById(id: string) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const memory = await prisma.memories.findUnique({
        where: {
            id,
            RelationShip: {
                users: {
                    some: {
                        clerkId: userId,
                    }
                }
            }
        },
        include: {
            RelationShip: {
                include: {
                    users: true,
                }
            },
            images: true,
        }
    })
    if (!memory) {
        throw new Error("Memory not found")
    }

    return memory
}
"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function joinRelationship(code: string) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const partnerUser = await prisma.user.findUnique({
        where: {
            relationShipCode: code,
            NOT: {
                clerkId: userId
            }
        }
    })

    if (!partnerUser) {
        return {
            success: false,
            message: "Please check the code and try again."
        }
    }

    const existingRelationship = await prisma.relationShip.findMany({
        where: {
            OR: [
                {
                    users: {
                        some: {
                            OR: [
                                { clerkId: userId },
                                { clerkId: partnerUser.clerkId }
                            ]
                        }
                    }
                },
            ]
        }
    })
    if (existingRelationship.length > 0) {
        return {
            success: false,
            message: "You are already in a relationship."
        }
    }

    await prisma.relationShip.create({
        data: {
            users: {
                connect: [
                    { clerkId: userId },
                    { clerkId: partnerUser.clerkId }
                ]
            }
        }
    })

    return {
        success: true,
        message: "Successfully joined the relationship!"
    }
}
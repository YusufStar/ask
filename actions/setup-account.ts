"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function setupAccount() {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    const code = createShipCode()

    const existingUser = await prisma.user.findUnique({
        where: { clerkId: userId }
    })
    if (existingUser) {
        await prisma.user.update({
            where: { clerkId: userId },
            data: {
                email: user?.emailAddresses?.[0]?.emailAddress,
            }
        })
        return { success: true, message: "Account already set up" }
    }

    await prisma.user.create({
        data: {
            clerkId: userId,
            email: user?.emailAddresses?.[0]?.emailAddress || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            avatar: user?.imageUrl || "",
            relationShipCode: code,
        }
    })

    return { success: true, message: "Account setup complete" }
}

const createShipCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
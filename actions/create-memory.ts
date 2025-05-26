"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { imageMeta } from "image-meta";

export const getAsset = async (url: string) => `${process.env.NEXT_PUBLIC_ASSET_API_URL!}${url}`;

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

export const uploadMemoryAssets = async (memoryId: string, assets: string[]) => {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await currentUser()
    if (!user) {
        throw new Error("User not found")
    }

    const processed = await Promise.all(
        (assets).map(async (asset) => {
            const arrayBuffer = await imgUrlToBlog(await getAsset(asset));
            const { width, height } = imageMeta(new Uint8Array(arrayBuffer));

            return {
                image_url: asset,
                width: Number(width),
                height: Number(height),
            };
        })
    );


    const memory = await prisma.memories.findUnique({
        where: {
            id: memoryId,
            RelationShip: {
                users: {
                    some: {
                        clerkId: userId,
                    }
                }
            },
        }
    })

    if (!memory) {
        throw new Error("Memory not found or does not belong to the user's relationship")
    }

    await prisma.memories.update({
        where: { id: memory.id },
        data: {
            images: {
                createMany: {
                    data: processed
                }
            }
        }
    })
}

export async function imgUrlToBlog(url: string) {
    const response = fetch(url);
    const blob = (await response).blob();

    return (await blob).arrayBuffer();
}
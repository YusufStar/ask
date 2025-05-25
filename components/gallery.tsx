"use client";

import { getMemoryById } from "@/actions/getMyRelationship";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { GalleryHeader } from "./gallery-header";


export default function Gallery({
    memoryId,
    placeholderData
}: {
    memoryId: string;
    placeholderData: Awaited<ReturnType<typeof getMemoryById>>;
}) {
    const { data, isPlaceholderData } = useQuery<Awaited<ReturnType<typeof getMemoryById>>>({
        queryKey: ['memory', memoryId],
        placeholderData: placeholderData,
        queryFn: () => getMemoryById(memoryId),
    })

    console.log("Gallery data:", data);

    return (
        <div className="flex flex-col min-h-screen p-4 w-full">
            {
                isPlaceholderData ? (
                    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
                        <Loader className="animate-spin" />
                    </div>
                ) : data ? (
                    <div className="w-full flex flex-col gap-4">
                        <GalleryHeader
                            users={data.RelationShip?.users || []}
                            content={data.content}
                            date={data.date}
                            location={data.location}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-screen text-2xl">
                        Memory not found
                    </div>
                )
            }
        </div>
    );
}
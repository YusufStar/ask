"use client";

import { getMemoryById } from "@/actions/getMyRelationship";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { GalleryHeader } from "./gallery-header";
import { useState } from "react";
import UploadModalOpen from "./upload-modal-open";
import Image from "next/image";
import { getAsset } from "@/lib/assets-axios";
import { AnimatePresence, motion } from "framer-motion";

export default function Gallery({
    memoryId,
    placeholderData
}: {
    memoryId: string;
    placeholderData: Awaited<ReturnType<typeof getMemoryById>>;
}) {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const { data, isPlaceholderData, refetch } = useQuery<Awaited<ReturnType<typeof getMemoryById>>>({
        queryKey: ['memory', memoryId],
        placeholderData: placeholderData,
        queryFn: () => getMemoryById(memoryId),
    })

    return (
        <div className="flex flex-col min-h-screen p-4 w-full">
            <UploadModalOpen open={uploadModalOpen} onOpenChange={setUploadModalOpen} memoryId={memoryId} refetch={refetch} />
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
                            setUploadModalOpen={setUploadModalOpen}
                        />

                        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 gap-4 w-full">
                            <AnimatePresence>
                                {data.images.map((image, index) => (
                                    <motion.div
                                        key={image.id}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-4 break-inside-avoid"
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        layout="position"
                                        style={{
                                            width: "100%",
                                            aspectRatio: image.width! / image.height!,
                                        }}
                                        transition={{
                                            opacity: { duration: 0.3 },
                                            layout: { duration: 0.3 },
                                        }}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                key={image.id}
                                                alt={image.id}
                                                fill
                                                className={`object-cover rounded transition-opacity duration-300`}
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                style={{ objectFit: "cover" }}
                                                src={getAsset(image.image_url)}
                                                placeholder="blur"
                                                blurDataURL={getAsset(image.placeholder_url)}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-screen text-2xl">
                        Memory not found
                    </div>
                )
            }
        </div >
    );
}
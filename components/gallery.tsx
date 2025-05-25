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
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function Gallery({
    memoryId,
    placeholderData
}: {
    memoryId: string;
    placeholderData: Awaited<ReturnType<typeof getMemoryById>>;
}) {
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
        {}
    );

    const handleImageLoad = (src: string | undefined) => {
        if (src) {
            setLoadedImages((prev) => ({ ...prev, [src]: true }));
        }
    };

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
                                        <Card className="p-0! relative w-full h-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group">
                                            <CardContent className="p-0! relative w-full h-full">
                                                {!loadedImages[image.id!] && (
                                                    <div className="absolute inset-0 z-10">
                                                        <Skeleton className="w-full h-full rounded-lg animate-pulse" />
                                                    </div>
                                                )}
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        key={image.id}
                                                        alt={image.id}
                                                        fill
                                                        style={{ objectFit: "cover" }}
                                                        src={getAsset(image.image_url)}
                                                        onLoad={() => handleImageLoad(image.id)}
                                                        className={`object-cover rounded transition-opacity duration-300 ${loadedImages[image.id!] ? "opacity-100" : "opacity-0"}`}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
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
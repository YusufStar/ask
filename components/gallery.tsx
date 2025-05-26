"use client";

import { getMemoryById } from "@/actions/getMyRelationship";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { GalleryHeader } from "./gallery-header";
import { useState, useMemo } from "react";
import UploadModalOpen from "./upload-modal-open";
import { getAsset } from "@/lib/assets-axios";
import { useWindowSize } from "@/hooks/use-window-size";
import Image from "next/image";

interface ImageState {
    isVisible: boolean;
    isLoaded: boolean;
    isLoading: boolean;
}

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
        refetchInterval: 5000,
    });

    const { width: windowWidth } = useWindowSize();
    const columns = useMemo(() => {
        if (!windowWidth) return 1;
        if (windowWidth > 1400) return 5;
        if (windowWidth > 1100) return 4;
        if (windowWidth > 800) return 3;
        if (windowWidth > 500) return 2;
        return 1;
    }, [windowWidth]);

    // Memoized image processing
    const processedImages = useMemo(() => {
        if (!data?.images) return [];
        return data.images
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(image => ({
                ...image,
                assetUrl: getAsset(image.image_url),
            }));
    }, [data?.images]);

    const masonryColumns = useMemo(() => {
        if (!processedImages.length) return [];
        const cols: Array<typeof processedImages[0][]> = Array.from({ length: columns }, () => []);
        const colHeights = Array(columns).fill(0);
        processedImages.forEach(img => {
            const aspect = Math.min(img.width / img.height, img.height / img.width);
            const minCol = colHeights.indexOf(Math.min(...colHeights));
            cols[minCol].push(img);
            colHeights[minCol] += aspect;
        });
        return cols;
    }, [processedImages, columns]);

    const renderImage = (image: typeof processedImages[0], index: number) => {
        return (
            <div
                key={image.id}
                className="relative w-full h-full"
                style={{ aspectRatio: `${Math.min(image.width / image.height, image.height / image.width)}` }}
            >
                <Image
                    alt={`Memory image ${index + 1}`}
                    src={image.assetUrl}
                    width={image.width}
                    height={image.height}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '0.5rem' }}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    className="rounded-lg"
                    priority={index < 4}
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen p-4 w-full">
            <UploadModalOpen
                open={uploadModalOpen}
                onOpenChange={setUploadModalOpen}
                memoryId={memoryId}
                refetch={refetch}
            />

            {isPlaceholderData ? (
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

                    <div className="w-full flex gap-x-4 items-start justify-center">
                        {masonryColumns.map((col, colIdx) => (
                            <div key={colIdx} className="flex flex-col gap-y-4" style={{ flex: 1, minWidth: 0 }}>
                                {col.map((image, idx) => renderImage(image, idx + colIdx * 1000))}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen text-2xl">
                    Memory not found
                </div>
            )}
        </div>
    );
}
"use client"

import { CheckCircle, CloudUpload, Loader, Paperclip, Trash } from "lucide-react";
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogHeader } from "./ui/dialog";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "./ui/file-upload";
import { useEffect, useState } from "react";
import { useFileUpload, getFileKey } from "@/hooks/use-file-upload";
import { uploadAsset } from "@/lib/assets-axios";
import { Button } from "./ui/button";
import { uploadMemoryAssets } from "@/actions/create-memory";

export default function UploadModalOpen({
    open,
    onOpenChange,
    memoryId,
    refetch
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memoryId: string;
    refetch: () => void;
}) {
    const [creating, setCreating] = useState(false);

    const {
        files,
        addFiles,
        removeFile,
        setFileLoading,
        setFileProgress,
        reset,
        filesLoading,
        filesProgress
    } = useFileUpload();

    const dropZoneConfig = {
        maxFiles: 50,
        maxSize: 2 * 1024 * 1024 * 1024, // 2GB in bytes
        multiple: true,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
        },
    };

    // Dosya seçimi değiştiğinde store'a ekle
    const handleFilesChange = (newFiles: File[] | null) => {
        if (newFiles) addFiles(newFiles);
    };

    // Modal kapandığında store'u sıfırla
    useEffect(() => {
        if (!open || !creating) {
            reset();
            setCreating(false);
        }
    }, [open, reset, creating]);

    // Tüm dosyalar yüklendi mi?
    const allUploaded = files.length > 0 && files.every(file => filesProgress[getFileKey(file)] === 100);
    // Herhangi bir dosya yükleniyor mu?
    const isUploading = Object.values(filesLoading).some(Boolean);

    // Yükleme işlemi
    const handleUpload = async () => {
        if (isUploading || creating) return;
        setCreating(true);
        const uploaded: string[] = [];
        for (const file of files) {
            const key = getFileKey(file);
            if (filesProgress[key] === 100) continue;
            setFileLoading(key, true);
            setFileProgress(key, 0);
            try {
                const response = await uploadAsset(file);
                uploaded.push(response.image);
                setFileProgress(key, 100);
            } catch {
                setFileProgress(key, 0);
            } finally {
                setFileLoading(key, false);
            }
        }
        await uploadMemoryAssets(memoryId, uploaded).finally(() => {
            refetch();
            onOpenChange(false);
            setCreating(false);
            reset();
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full! max-w-2xl!">
                <DialogHeader>
                    <DialogTitle>
                        Upload Photos
                    </DialogTitle>
                    <DialogDescription>
                        Select photos to upload to your memory.
                    </DialogDescription>
                </DialogHeader>
                <FileUploader
                    value={files}
                    onValueChange={handleFilesChange}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2"
                >
                    {/* Sadece tüm dosyalar yüklenmemiş ve yükleme yoksa FileInput göster */}
                    {!(allUploaded || isUploading) && (
                        <FileInput
                            id="fileInput"
                            className="outline-dashed outline-1 outline-slate-500"
                        >
                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                <CloudUpload className='text-gray-500 w-10 h-10' />
                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span>
                                    &nbsp; or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Supported formats: JPG, PNG, WEBP, JPEG Max size: 2GB.
                                </p>
                            </div>
                        </FileInput>
                    )}
                    <FileUploaderContent>
                        {files &&
                            files.length > 0 &&
                            files.map((file, i) => {
                                const key = getFileKey(file);
                                const isUploading = filesLoading[key];
                                const isDone = filesProgress[key] === 100;
                                return (
                                    <FileUploaderItem key={key} index={i}>
                                        <Paperclip className="h-4 w-4 stroke-current" />
                                        <span>{file.name}</span>
                                        {isUploading && <Loader className="animate-spin inline-block w-4 h-4 text-blue-500 ml-auto" />}
                                        {filesProgress[key] > 0 && filesProgress[key] < 100 && (
                                            <span className="ml-2 text-xs text-gray-400">%{filesProgress[key]}</span>
                                        )}
                                        {isDone && <CheckCircle className="inline-block w-4 h-4 text-green-500 ml-auto" />}
                                        {!isUploading && !isDone && (
                                            <button
                                                className="ml-auto text-red-500 hover:text-red-700"
                                                onClick={() => removeFile(key)}
                                            >
                                                <Trash />
                                            </button>
                                        )}
                                    </FileUploaderItem>
                                );
                            })}
                    </FileUploaderContent>
                </FileUploader>
                <Button
                    className="w-full mt-4"
                    onClick={handleUpload}
                    disabled={isUploading || allUploaded || creating || files.length === 0}
                >
                    {isUploading || creating ? <Loader className="animate-spin" /> : "Upload Files"}
                </Button>
            </DialogContent>
        </Dialog >
    );
}
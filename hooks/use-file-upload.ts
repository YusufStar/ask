import { create } from "zustand";

interface FileUploadState {
    files: File[];
    filesLoading: { [key: string]: boolean };
    filesProgress: { [key: string]: number };
    addFiles: (files: File[]) => void;
    removeFile: (fileKey: string) => void;
    setFileLoading: (fileKey: string, loading: boolean) => void;
    setFileProgress: (fileKey: string, progress: number) => void;
    reset: () => void;
}

// Helper to generate a unique key for a file
const getFileKey = (file: File) => `${file.name}_${file.size}_${file.lastModified}`;

export const useFileUpload = create<FileUploadState>((set) => ({
    files: [],
    filesLoading: {},
    filesProgress: {},
    addFiles: (newFiles) =>
        set((state) => {
            const existingKeys = new Set(state.files.map((f) => getFileKey(f)));
            const uniqueFiles = newFiles.filter(
                (file) => !existingKeys.has(getFileKey(file))
            );
            return {
                files: [...state.files, ...uniqueFiles],
                filesLoading: {
                    ...state.filesLoading,
                    ...Object.fromEntries(uniqueFiles.map((file) => [getFileKey(file), false])),
                },
                filesProgress: {
                    ...state.filesProgress,
                    ...Object.fromEntries(uniqueFiles.map((file) => [getFileKey(file), 0])),
                },
            };
        }),
    removeFile: (fileKey) =>
        set((state) => ({
            files: state.files.filter((file) => getFileKey(file) !== fileKey),
            filesLoading: Object.fromEntries(
                Object.entries(state.filesLoading).filter(([key]) => key !== fileKey)
            ),
            filesProgress: Object.fromEntries(
                Object.entries(state.filesProgress).filter(([key]) => key !== fileKey)
            ),
        })),
    setFileLoading: (fileKey, loading) =>
        set((state) => ({
            filesLoading: { ...state.filesLoading, [fileKey]: loading },
        })),
    setFileProgress: (fileKey, progress) =>
        set((state) => ({
            filesProgress: { ...state.filesProgress, [fileKey]: progress },
        })),
    reset: () =>
        set({ files: [], filesLoading: {}, filesProgress: {} }),
}));

export { getFileKey };

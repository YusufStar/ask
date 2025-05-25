import { getMemoryById } from "@/actions/getMyRelationship";
import Gallery from "@/components/gallery";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const placeholderData = await getMemoryById(id);

    if (!placeholderData) {
        return <div className="flex items-center justify-center min-h-screen text-2xl">Memory not found</div>;
    }

    return <Gallery memoryId={id} placeholderData={placeholderData} />;
}

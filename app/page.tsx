import { getMyUserDetail } from "@/actions/get-my-user-details";
import { getMyRelationship, getMyShipMemories } from "@/actions/getMyRelationship";
import { CreateRelationship } from "@/components/create-relationship";
import MemoryGallery from "@/components/memory-gallery";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getMyUserDetail();

  if (user === null) {
    redirect("/setup");
  }

  const ship = await getMyRelationship();

  if (ship === null) {
    return <CreateRelationship yourCode={user.relationShipCode} />
  }

  const memories = await getMyShipMemories();

  return <MemoryGallery users={ship.users} firstMemories={memories} />
}

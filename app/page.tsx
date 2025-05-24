import { getMyUserDetail } from "@/actions/get-my-user-details";
import { getMyRelationship } from "@/actions/getMyRelationship";
import { CreateRelationship } from "@/components/create-relationship";
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

  return <div>Gallery</div>
}

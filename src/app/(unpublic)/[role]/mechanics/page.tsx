import { authorizePage } from "@/lib/authorize";
import MechanicsView from "@/components/pages/MechanicsView";
import type { Mechanic } from "@/types/mechanics";

export default async function MechanicsPage() {
  const session = await authorizePage(["admin"]);
  const data: Mechanic[] = [];
  try {
    const data = await fetch("http://localhost:3000/api/mechanics", {
      method: "GET",
      cache: "no-store",
    });
    if (!data.ok) {
      throw new Error("Fetch of data failed for mechanics");
    }
    const mechanics: Mechanic[] = await data.json();
    return (
      <MechanicsView
        dataMechanics={mechanics}
        session={session}
      ></MechanicsView>
    );
  } catch (error) {
    console.error("Error in MechanicPage:", error);
    return <MechanicsView dataMechanics={[]} session={session}></MechanicsView>;
  }
}

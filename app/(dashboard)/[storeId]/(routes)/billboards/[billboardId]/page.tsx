import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
    params
}: {
    params:{ billboardId: string }
}) => {
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    });
    return (
        <div className="flex-col">
            <div className="flex-1 md:space-y-4 md:p-8 md:pt-6 space-y-2 px-4 pt-4">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
    );
}

export default BillboardPage;
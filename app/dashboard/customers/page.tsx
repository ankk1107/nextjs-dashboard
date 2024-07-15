import { fetchFilteredCustomers } from "@/app/lib/data";
import { FormattedCustomersTable } from "@/app/lib/definitions";
import CustomersTable from "@/app/ui/customers/table";
import { Suspense } from "react";

export default async function Customers({ searchParams }: {
    searchParams?: {
        query: string,
    }
}) {
    const query = searchParams?.query || '';
    const customers: FormattedCustomersTable[] = await fetchFilteredCustomers(query);

    return <div className="w-full">
        <Suspense fallback={<div>loading...</div>}>
            <CustomersTable customers={customers} />
        </Suspense>
    </div>
}
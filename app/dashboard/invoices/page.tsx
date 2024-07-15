import { fetchInvoicesPages } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import Pagination from "@/app/ui/invoices/pagination";
import InvoicesTable from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: 'Invoices | KK Acme Dashboard'
}

export default async function Invoices({ searchParams }: {
    searchParams?: {
        query?: string,
        page?: string
    }
}) {
    const query = searchParams?.query || '';
    const page = Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
            </div>
            <div className="flex mt-4 items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search Invoice..." />
                <CreateInvoice />
            </div>
            <Suspense fallback={<InvoicesTableSkeleton />}>
                <InvoicesTable query={query} currentPage={page} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}
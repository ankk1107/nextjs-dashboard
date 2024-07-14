import clsx from "clsx";
import { lusitana } from "../ui/fonts";
import RevenueChart from "../ui/dashboard/revenue-chart";
import LatestInvoices from "../ui/dashboard/latest-invoices";
import { Card } from "../ui/dashboard/cards";
import { LatestInvoice } from "../lib/definitions";
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from "../lib/data";

export default async function Page() {
    const revenue = await fetchRevenue();
    const latestInvoices: LatestInvoice[] = await fetchLatestInvoices();
    const  {
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices,
      } = await fetchCardData();
    return <main>
        <h2 className={clsx(`${lusitana.className} mb-4 text-xl md:text-2xl`)}>dashboard page</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card type="invoices" title="invoices" value={numberOfInvoices} />
            <Card type="customers" title="customers" value={numberOfCustomers} />
            <Card type="pending" title="pending" value={totalPendingInvoices} />
            <Card type="collected" title="collected" value={totalPaidInvoices} />
        </div>
        <div className="grid mt-6 grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <RevenueChart revenue={revenue}/>
            <LatestInvoices latestInvoices={latestInvoices} />
        </div>
    </main>
}
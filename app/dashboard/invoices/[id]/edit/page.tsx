import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";

export default async function Edit({ params }: {
    params: { id: string }
}) {
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(params.id),
        fetchCustomers(),
    ])
    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                { label: 'Invoices', active: false, href: '/dashboard/invoices' },
                {
                    label: 'Edit Invoice',
                    active: true,
                    href: `/dashboard/invoices/${params.id}/edit`
                }
            ]} />
            <EditInvoiceForm invoice={invoice} customers={customers}></EditInvoiceForm>
        </main>
    )
}
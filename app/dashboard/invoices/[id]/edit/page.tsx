/* eslint-disable react/jsx-indent-props */
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/actions'
import { notFound } from 'next/navigation'
import InvoiceForm from '@/app/ui/invoices/form'

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ])
    if (!invoice) {
        return notFound()
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true
                    }
                ]}
            />
            <InvoiceForm invoice={invoice} customers={customers} type='edit' />
        </main>
    )
}

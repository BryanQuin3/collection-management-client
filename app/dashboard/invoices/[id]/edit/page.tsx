/* eslint-disable react/jsx-indent-props */
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/actions'
import InvoiceForm from '@/app/ui/invoices/form'
import { revalidateTag } from 'next/cache'

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ])
    if (invoice === null) revalidateTag('/invoice')

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

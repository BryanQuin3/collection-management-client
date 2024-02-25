/* eslint-disable react/jsx-indent-props */
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers } from '@/app/lib/actions'
import { revalidateTag } from 'next/cache'
import InvoiceForm from '@/app/ui/invoices/form'

export default async function Page() {
    const customers = await fetchCustomers()
    revalidateTag('/dashboard/invoices')
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Create Invoice',
                        href: '/dashboard/invoices/create',
                        active: true
                    }
                ]}
            />
            <InvoiceForm customers={customers} type='create' />
        </main>
    )
}

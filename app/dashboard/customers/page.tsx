/* eslint-disable indent */
// eslint-disable-next-line space-before-function-paren
import CustomersTable from '@/app/ui/customers/table'
import { lusitana } from '@/app/ui/fonts'
import { CreateCustomer } from '@/app/ui/invoices/buttons'
import Search from '@/app/ui/search'
import { CustomersTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'

type Props = {
    searchParams?: {
        query?: string
    }
}
export default function CustomersPage({ searchParams }: Props) {
    const query = searchParams?.query || ''
    return (
        <div className='w-full'>
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Customers
            </h1>
            <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
                <Search placeholder='Search customers...' />
                <CreateCustomer />
            </div>
            <Suspense key={query} fallback={<CustomersTableSkeleton />}>
                <CustomersTable query={query} />
            </Suspense>
        </div>
    )
}

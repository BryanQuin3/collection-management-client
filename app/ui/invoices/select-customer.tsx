'use client'
import { useState, useEffect } from "react"
import { CustomerField } from '@/app/lib/definitions'

export function SelectCustomer() {
    const [customers, setCustomers] = useState([] as CustomerField[])
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    useEffect(() => {
        fetch(`${BASE_URL}/customers`)
            .then((res) => res.json())
            .then((data) => setCustomers(data))
    }, [])
    return (
        <select
            id='customer'
            name='customerId'
            className='peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
            defaultValue=''
            aria-describedby='customer-error'
        >
            <option value='' disabled>
                Select a customer
            </option>
            {customers?.map((customer) => (
                <option key={customer._id} value={customer._id}>
                    {customer.name}
                </option>
            ))}
        </select>
    )
}
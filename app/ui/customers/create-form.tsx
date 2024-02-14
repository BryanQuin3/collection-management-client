'use client'
import { useFormState } from 'react-dom'
import { createCustomer } from '@/app/lib/actions'
import { Button } from '../button'
import Link from 'next/link'

export default function Form() {
    const initialState = { message: null, errors: {} }
    const [state, dispatch] = useFormState(createCustomer, initialState)
    return (
        <form action={dispatch} aria-describedby='form-error'>
            <div className='rounded-md bg-gray-50 p-4 md:p-6'>
                {/* Name */}
                <div className='mb-4'>
                    <label htmlFor='customer' className='mb-2 block text-sm font-medium'>
                        Customer Name
                    </label>
                    <div className='relative'>
                        <input id='name' name='name' type='text' placeholder='Peter Milk' className='peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500' aria-describedby='customer-error' required />
                    </div>
                    <div id='customer-error' aria-live='polite' aria-atomic='true'>
                        {state?.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p className='mt-2 text-sm text-red-500' key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Email */}
                <div className='mb-4'>
                    <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
                        Customer Email
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <input id='email' name='email' type='email' placeholder='example@gmail.com' className='peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500' aria-describedby='amount-error' required />
                    </div>
                </div>
                <div id='email-error' aria-live='polite' aria-atomic='true'>
                    {state?.errors?.email &&
                        state.errors.email.map((error: string) => (
                            <p className='mt-2 text-sm text-red-500' key={error}>
                                {error}
                            </p>
                        ))}
                </div>

                {/* Image Url */}
                <div className='mb-4'>
                    <label htmlFor='image' className='mb-2 block text-sm font-medium'>
                        Image URL
                    </label>
                    <div className='relative mt-2 rounded-md'>
                        <input id='image_url' name='image_url' type='text' placeholder=' https://www.example.com/image.jpg' className='peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500' aria-describedby='image-error' required />
                    </div>
                </div>
            </div>
            <div id='form-error' aria-live='polite' aria-atomic='true'>
                {state?.message && <p className='mt-2 text-sm text-red-500'>{state.message}</p>}
            </div>
            <div className='mt-6 flex justify-end gap-4'>
                <Link
                    href='/dashboard/customers'
                    className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
                >
                    Cancel
                </Link>
                <Button type='submit'>Create Customer</Button>
            </div>
        </form>
    )
}
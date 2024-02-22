'use client'
import { lusitana } from '@/app/ui/fonts'
import {
    AtSymbolIcon,
    ExclamationCircleIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from './button'
import { useFormState } from 'react-dom'
import { register } from '@/app/lib/actions'
import Link from 'next/link'
import PasswordField from './password'

export default function RegisterForm() {
    const initialState = { message: null, errors: {} }
    const [state, dispatch] = useFormState(register, initialState)

    return (
        <form className='space-y-3' action={dispatch}>
            <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Create an account to continue.
                </h1>
                <div className='w-full grid grid-cols-1 gap-x-3 md:grid-cols-2'>
                    {/* name */}
                    <div>
                        <label
                            className='mb-3 mt-5 block text-sm font-medium text-gray-900'
                            htmlFor='name'
                        >
                            Name
                        </label>
                        <div className='relative'>
                            <input
                                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                                id='name'
                                type='text'
                                name='name'
                                placeholder='Enter your name'
                                required
                            />
                            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                        </div>
                    </div>
                    <div>
                        <label
                            className='mb-3 mt-5 block text-sm font-medium text-gray-900'
                            htmlFor='email'
                        >
                            Email
                        </label>
                        <div className='relative'>
                            <input
                                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                                id='email'
                                type='email'
                                name='email'
                                placeholder='Enter your email'
                                required
                            />
                            <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                        </div>
                    </div>
                    {/* password */}
                    <PasswordField
                        label='Password'
                        id='password'
                        name='password'
                        placeholder='Enter password'
                    />
                    {/* confirm password */}
                    <PasswordField
                        label='Confirm Password'
                        id='confirmPassword'
                        name='confirmPassword'
                        placeholder='Confirm password'
                    />
                </div>
                <RegisterButton />
                <div className='flex items-center gap-2 justify-between'>
                    <span className='text-sm text-gray-700'>Already have an account?</span>
                    <Link href='/login'>
                        <span className='text-blue-500 text-xs uppercase font-semibold md:text-sm'>Sign in</span>
                    </Link>
                </div>
                <div className='flex h-8 items-end space-x-1 mt-4'>
                    {state?.message && (
                        <p
                            id='form-error'
                            className='text-red-500 text-sm'
                            aria-live='polite'
                            aria-atomic='true'
                        >
                            <ExclamationCircleIcon className='h-4 w-4 inline' />
                            <span className='ml-1'>{state.message}</span>
                        </p>
                    )}
                </div>

            </div>
        </form>
    )
}

function RegisterButton() {
    return (
        <Button className='my-5 w-full flex justify-between'>
            Sign Up <ArrowRightIcon className='ml-3 h-5 w-5 text-gray-50' />
        </Button>
    )
}

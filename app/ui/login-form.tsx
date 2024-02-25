'use client'
import { lusitana } from '@/app/ui/fonts'
import {
  AtSymbolIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from './button'
import { useFormState } from 'react-dom'
import { useState, useEffect } from 'react'
import { login } from '@/app/lib/actions'
import PasswordField from './password'

export default function LoginForm() {
  const initialState = { message: null, errors: {}, status: '' }
  const [state, dispatch] = useFormState(login, initialState)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (state?.status) {
      setLoading(false);
    }
  }, [state?.status]);

  return (
    <form className='space-y-3' action={dispatch} onSubmit={() => setLoading(true)}>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className='w-full'>
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
                placeholder='Enter your email address'
                required
              />
              <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
          <PasswordField
            label='Password'
            id='password'
            name='password'
            placeholder='Enter your password'
          />
        </div>
        <LoginButton loading={loading} />
        <div className='flex h-8 items-end space-x-1'>
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
          )
          }
        </div>

      </div>
    </form>
  )
}

type LoginButtonProps = {
  loading: boolean
}

function LoginButton({ loading }: LoginButtonProps) {
  return (
    <Button className='mt-4 w-full'>
      {
        loading ?
          <div className='flex items-center justify-between w-full'>
            <span className=''>Loading...</span>
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spinner" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
          </div>
          :
          <div className='flex items-center justify-between w-full'>
            Log in <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
          </div>
      }
    </Button>
  )
}

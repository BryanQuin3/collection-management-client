'use client'
import { lusitana } from '@/app/ui/fonts'
import {
  AtSymbolIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from './button'
import { useFormState } from 'react-dom'
import { login } from '@/app/lib/actions'
import PasswordField from './password'
import { Loading } from './loading'
import { LoadingProps } from '../lib/definitions'
import { useLoading } from '../hooks/useLoading'

export default function LoginForm() {
  const initialState = { message: null, errors: {}, status: '' }
  const [state, dispatch] = useFormState(login, initialState)
  const { loading, setLoading } = useLoading(state.status)

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



function LoginButton({ loading }: LoadingProps) {
  return (
    <Button className='mt-4 w-full'>
      {
        loading ?
          <Loading />
          :
          <div className='flex items-center justify-between w-full'>
            Log in <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
          </div>
      }
    </Button>
  )
}

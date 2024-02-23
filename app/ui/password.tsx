'use client'
import { KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type PasswordFieldProps = {
    label: string
    id: 'password' | 'confirmPassword'
    name: 'password' | 'confirmPassword'
    placeholder: string
    validate?: boolean
}

export default function PasswordField({ label, id, name, placeholder, validate }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div>
            <label
                className='mb-3 mt-5 block text-sm font-medium text-gray-900'
                htmlFor='password'
            >
                {label}
            </label>
            <div className='relative'>
                <input
                    className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    placeholder={placeholder}
                    required
                    minLength={8}
                    pattern={validate ? '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$' : undefined}
                    title={validate ? 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers' : undefined}
                />
                <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
                {
                    !showPassword ?
                        <EyeIcon onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 hover:cursor-pointer' />
                        :
                        <EyeSlashIcon onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 hover:cursor-pointer' />
                }

            </div>
        </div>
    )
}
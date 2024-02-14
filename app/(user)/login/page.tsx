import AcmeLogo from '@/app/ui/acme-logo'
import LoginForm from '@/app/ui/login-form'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <main className='grid place-items-center h-screen'>
            <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4'>
                <div className='flex h-20 w-full justify-center items-center rounded-lg bg-blue-500 p-3 md:h-36'>
                    <div className='text-white'>
                        <AcmeLogo />
                    </div>
                </div>
                <LoginForm />
                <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-700'>You don&apos;t have an account?</span>
                    <Link href='/register'>
                        <span className='text-blue-500 text-sm uppercase font-semibold'>Create an account</span>
                    </Link>
                </div>
            </div>
        </main >
    )
}

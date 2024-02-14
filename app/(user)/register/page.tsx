import AcmeLogo from '@/app/ui/acme-logo'
import RegisterForm from '@/app/ui/register-form'

export default function RegisterPage() {
    return (
        <main className='grid place-items-center h-screen'>
            <div className='relative mx-auto flex w-full max-w-[520px] flex-col space-y-2.5 p-4'>
                <div className='flex h-20 w-full justify-center items-center rounded-lg bg-blue-500 p-3 md:h-36'>
                    <div className='text-white'>
                        <AcmeLogo />
                    </div>
                </div>
                <RegisterForm />
            </div>
        </main >
    )
}

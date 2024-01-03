import { Button } from '@/components/elements'
import { RegisterForm } from '@/components/forms'
import Image from 'next/image'
import Link from 'next/link'

export default function RegisterPage() {
	return (
		<main className='w-[min(100%-1rem,25rem)]'>
			<Image
				src='/assets/logo-text.svg'
				alt='Logo'
				width={171}
				height={36}
				className='mx-auto mb-16'
				priority
			/>
			<h1 className='text-3xl font-bold mb-3 text-center'>
				Create a new account
			</h1>
			<p className='text-neutral-500 text-center'>
				To use Snapgram, please enter your details.
			</p>
			<RegisterForm />
			<p className='mt-8 text-center'>
				Already have an account?{' '}
				<Link
					href='/login'
					className='text-primary-500 font-medium hover:text-primary-400'
				>
					Log in
				</Link>
			</p>
		</main>
	)
}

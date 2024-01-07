import LoginForm from './login-form'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
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
				Log in to your account
			</h1>
			<p className='text-neutral-500 text-center'>
				Welcome back! Please enter your details.
			</p>
			<LoginForm />
			<p className='mt-8 text-center'>
				Don't have an account?{' '}
				<Link
					href='/register'
					className='text-primary-500 font-semibold hover:text-primary-400'
				>
					Sign up
				</Link>
			</p>
		</main>
	)
}

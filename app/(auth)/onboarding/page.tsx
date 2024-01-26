import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import OnboardingForm from './onboarding-form'

export default async function OnboardingPage() {
	const session = await getCurrentUser()

	if (!session) {
		redirect('/login')
	}

	if (session && session?.user?.onboarded) {
		console.log(
			'!!! redirected from OnboardingPage because of (session && session?.user?.onboarded)'
		)
		redirect('/')
	}

	return (
		<main className='w-[min(100%-1rem,30rem)]'>
			<Image
				src='/assets/logo-text.svg'
				alt='Logo'
				width={171}
				height={36}
				className='mb-16'
				priority
			/>
			<h1 className='text-3xl font-bold mb-3'>Onboarding</h1>
			<p className='text-neutral-500'>Complete your profile to continue.</p>
			<OnboardingForm />
		</main>
	)
}
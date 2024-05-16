'use client'

import { Button, TextInput } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import Loader from '@/components/loader'
import ErrorMessage from '@/components/error-message'
import {
	handleOnboardingBackButtonClick,
	onboard
} from '@/lib/actions/user.actions'
import { OnboardingFields, onboardingSchema } from '@/lib/zod/user.schema'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import Textarea from '@/components/elements/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@/hooks/use-auth'

export default function OnboardingForm() {
	const { user: currentUser } = useAuth()
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<OnboardingFields>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			name: currentUser.name ?? '',
			username: currentUser.username ?? '',
			bio: currentUser.bio ?? ''
		}
	})
	const router = useRouter()

	const onSubmit: SubmitHandler<OnboardingFields> = async data => {
		const response = await onboard(currentUser._id, { ...data })

		if (!response.success) {
			setError('root', { message: response.message })
			return
		}

		router.replace('/')
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<TextInput
				label='Full Name'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.name?.message}
				{...register('name')}
			/>
			<TextInput
				label='Username'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.username?.message}
				{...register('username')}
			/>
			<Textarea
				label='Bio (optional)'
				rows={6}
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.bio?.message}
				{...register('bio')}
			/>

			{errors.root && <ErrorMessage message={errors.root.message} />}

			<div className='flex justify-between items-center mt-8'>
				<Button
					variant='dark'
					size='sm'
					disabled={isSubmitting}
					onClick={async () => {
						await Promise.all([
							handleOnboardingBackButtonClick({ email: currentUser.email }),
							signOut({ callbackUrl: '/register' })
						])
					}}
				>
					<Image
						src='/assets/icons/arrow-left.svg'
						alt=''
						width={16}
						height={17}
					/>
					Back
				</Button>

				<SubmitButton
					pendingContent={<Loader text={'Please wait...'} />}
					size='sm'
					disabled={isSubmitting}
				>
					Continue to Snapgram
				</SubmitButton>
			</div>
		</form>
	)
}

'use client'

import { TextInput } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import Textarea from '@/components/elements/textarea'
import ErrorMessage from '@/components/error-message'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/use-auth'
import {
	handleOnboardingBackButtonClick,
	onboard
} from '@/lib/actions/user.actions'
import { OnboardingFields, onboardingSchema } from '@/lib/zod/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export default function OnboardingForm() {
	const { user: currentUser } = useAuth()
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors }
	} = useForm<OnboardingFields>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			name: currentUser.name ?? ''
		}
	})
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const onSubmit: SubmitHandler<OnboardingFields> = async data => {
		startTransition(async () => {
			const response = await onboard(currentUser._id, { ...data })

			if (!response.success) {
				setError('root', { message: response.message })
				return
			}

			router.replace('/')
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<TextInput
				label='Full Name'
				className='mt-6'
				disabled={isPending}
				errors={errors.name?.message}
				{...register('name')}
			/>
			<TextInput
				label='Username'
				className='mt-6'
				disabled={isPending}
				errors={errors.username?.message}
				{...register('username')}
			/>
			<Textarea
				label='Bio (optional)'
				rows={6}
				className='mt-6'
				disabled={isPending}
				errors={errors.bio?.message}
				{...register('bio')}
			/>

			{errors.root && <ErrorMessage message={errors.root.message} />}

			<div className='flex justify-between items-center mt-8'>
				<Button
					type='button'
					size='lg'
					disabled={isPending}
					onClick={async () => {
						await Promise.all([
							handleOnboardingBackButtonClick({ email: currentUser.email }),
							signOut({ callbackUrl: '/register' })
						])
					}}
					className='bg-neutral-600 text-neutral-100 hover:bg-neutral-600/90 h-12 flex items-center gap-2'
				>
					<ArrowLeft size={16} />
					Back
				</Button>

				<SubmitButton
					pendingContent={<Loader text={'Please wait...'} />}
					size='lg'
					disabled={isPending}
					className='h-12'
				>
					Continue to Snapgram
				</SubmitButton>
			</div>
		</form>
	)
}

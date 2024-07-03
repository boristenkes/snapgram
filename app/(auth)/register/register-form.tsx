'use client'

import { TextInput } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import ErrorMessage from '@/components/error-message'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import { createUser } from '@/lib/actions/user.actions'
import { RegisterUserFields, registerUserSchema } from '@/lib/zod/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'

export default function RegisterForm() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<RegisterUserFields>({
		resolver: zodResolver(registerUserSchema)
	})
	const router = useRouter()

	const onSubmit: SubmitHandler<RegisterUserFields> = async data => {
		const { email, password } = data

		const serverResp = await createUser({ email, password })

		if (!serverResp.success) {
			setError('root', { message: serverResp.message })
			return
		}

		const signInResponse = await signIn('credentials', {
			email,
			password,
			redirect: false
		})

		if (signInResponse?.error) {
			setError('root', { message: signInResponse?.error })
			return
		}

		router.replace('/onboarding')
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<TextInput
				type='email'
				label='Email'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.email?.message}
				{...register('email')}
			/>
			<TextInput
				type='password'
				label='Password'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.password?.message}
				{...register('password')}
			/>
			<TextInput
				type='password'
				label='Confirm Password'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.confirmPassword?.message}
				{...register('confirmPassword')}
			/>

			{errors.root && <ErrorMessage message={errors.root.message} />}

			<SubmitButton
				className='mt-8 w-full h-12'
				size='lg'
				pendingContent={<Loader text='Please wait...' />}
				disabled={isSubmitting}
			>
				Register
			</SubmitButton>

			<div className='or-line' />

			<Button
				size='lg'
				onClick={() => signIn('google', { callbackUrl: '/' })}
				className='flex items-center gap-2 w-full bg-neutral-200 border-neutral-200 text-neutral-700 hover:bg-neutral-200/90 h-12'
				type='button'
			>
				<Image
					src='/assets/icons/google.svg'
					alt='Google logo'
					width={19}
					height={18}
				/>
				Continue with Google
			</Button>
		</form>
	)
}

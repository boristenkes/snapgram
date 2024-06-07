'use client'

import { Button, TextInput } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import ErrorMessage from '@/components/error-message'
import Loader from '@/components/loader'
import { loginUserSchema, type LoginFields } from '@/lib/zod/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<LoginFields>({
		resolver: zodResolver(loginUserSchema)
	})
	const router = useRouter()

	const onSubmit: SubmitHandler<LoginFields> = async data => {
		const res = await signIn('credentials', {
			email: data.email,
			password: data.password,
			redirect: false
		})

		if (res?.error) {
			setError('root', { message: res.error })
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

			{errors.root && <ErrorMessage message={errors.root.message} />}

			<SubmitButton
				stretch
				className='mt-8'
				pendingContent={<Loader text='Please wait...' />}
				disabled={isSubmitting}
			>
				Log in
			</SubmitButton>

			<div className='or-line' />

			<Button
				variant='light'
				onClick={() => signIn('google', { callbackUrl: '/' })}
				stretch
			>
				<Image
					src='/assets/icons/google.svg'
					alt='Google logo'
					width={25}
					height={24}
				/>
				Continue with Google
			</Button>
		</form>
	)
}

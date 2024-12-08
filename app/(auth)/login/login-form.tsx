'use client'

import { TextInput } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import ErrorMessage from '@/components/error-message'
import Loader from '@/components/loader'
import { Button } from '@/components/ui/button'
import { loginUserSchema, type LoginFields } from '@/lib/zod/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors }
	} = useForm<LoginFields>({
		resolver: zodResolver(loginUserSchema)
	})
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const onSubmit: SubmitHandler<LoginFields> = async data => {
		startTransition(async () => {
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
		})
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
				disabled={isPending}
				errors={errors.email?.message}
				{...register('email')}
			/>
			<TextInput
				type='password'
				label='Password'
				className='mt-6'
				disabled={isPending}
				errors={errors.password?.message}
				{...register('password')}
			/>

			{errors.root && <ErrorMessage message={errors.root.message} />}

			<SubmitButton
				className='mt-8 w-full h-12'
				size='lg'
				pendingContent={<Loader text='Please wait...' />}
				disabled={isPending}
			>
				Log in
			</SubmitButton>

			<div className='or-line' />

			<Button
				size='lg'
				onClick={() => signIn('google', { callbackUrl: '/' })}
				className='flex items-center gap-2 w-full bg-neutral-200 border-neutral-200 text-neutral-700 hover:bg-neutral-200/90 h-12'
				type='button'
				disabled={isPending}
			>
				<Image
					src='/assets/icons/google.svg'
					alt='Google logo'
					width={19}
					height={18}
				/>
				Continue with Google
			</Button>

			<Button
				type='button'
				onClick={() =>
					onSubmit({ email: 'demo@example.com', password: '_Demo123' })
				}
				variant='ghost'
				className='text-center w-full mt-4'
				disabled={isPending}
			>
				{isPending ? (
					<Loader text='Please wait...' />
				) : (
					'✨ Continue with Demo account ✨'
				)}
			</Button>
		</form>
	)
}

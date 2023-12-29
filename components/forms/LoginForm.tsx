'use client'

import { Button, Input } from '../elements'
import Image from 'next/image'
import { LoginValidation } from '@/lib/validations/user'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const fields: FormField[] = [
	{
		type: 'email',
		name: 'email',
		label: 'email',
		required: true,
		errors: []
	},
	{
		type: 'password',
		name: 'password',
		label: 'password',
		required: true,
		errors: []
	}
]

export default function LoginForm() {
	const router = useRouter()
	const [formFields, setFormFields] = useState<FormField[]>(fields)

	const clientAction = async (formData: FormData) => {
		// client-side validation
		const validationResult = LoginValidation.safeParse({
			email: formData.get('email'),
			password: formData.get('password')
		})

		// clear previous errors
		setFormFields(prevFields =>
			prevFields.map(field => ({ ...field, errors: [] }))
		)

		// display new errors, if there are some
		if (!validationResult.success) {
			const formattedErrors = validationResult.error.format()

			setFormFields(prevFields =>
				prevFields.map(field => ({
					...field,
					// @ts-ignore
					errors: formattedErrors[field.name]?._errors || []
				}))
			)
			return
		}

		const { email, password } = validationResult.data

		const res = await signIn('credentials', {
			redirect: false,
			email,
			password
		})
		if (!res?.error) {
			router.push('/')
		} else {
			toast('Invalid email or password', {
				icon: (
					<Image
						src='/assets/icons/error.webp'
						alt=''
						width={20}
						height={20}
					/>
				),
				style: {
					borderRadius: '10px',
					background: '#333',
					color: '#fff'
				}
			})
		}
	}

	return (
		<form
			action={clientAction}
			noValidate
		>
			{formFields.map(field => (
				<Input
					key={field.name}
					{...field}
				/>
			))}
			<Button
				stretch
				className='mt-8'
				type='submit'
			>
				Log in
			</Button>
			<div className='or-line' />
			<Button
				onClick={() => signIn('google', { callbackUrl: '/' })}
				stretch
				className='mt-5'
				color='light'
				startIcon={
					<Image
						src='/assets/icons/google.svg'
						alt='Google logo'
						width={25}
						height={24}
					/>
				}
			>
				Continue with Google
			</Button>
		</form>
	)
}

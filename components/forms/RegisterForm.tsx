'use client'

import Image from 'next/image'
import { Button, Input } from '../elements'
import { registerUser } from '@/lib/actions/user.actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { signIn } from 'next-auth/react'
import { RegisterValidation } from '@/lib/validations/user'
import toast from 'react-hot-toast'
import { FormField } from '@/lib/types'
import SubmitButton from '../elements/SubmitButton'
import Loader from '../Loader'

const fields: FormField[] = [
	{
		type: 'text',
		name: 'username',
		label: 'username',
		required: true,
		errors: []
	},
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

export default function RegisterForm() {
	const [formFields, setFormFields] = useState<FormField[]>(fields)

	const clientAction = async (formData: FormData) => {
		// client-side validation
		const validationResult = validateForm(setFormFields, formData)

		if (!validationResult) return

		// register user
		const response = await registerUser(validationResult.data)

		// display error occured in server validation, if there is one
		if (response?.error) {
			toast(response.error, {
				icon: (
					<Image
						src='/assets/icons/error.webp'
						alt=''
						width={20}
						height={20}
					/>
				),
				style: {
					borderRadius: '8px',
					background: '#333',
					color: '#fff'
				}
			})
			return
		}

		// everything went well, sign in new user
		const { email, password } = validationResult.data
		signIn('credentials', { email, password, callbackUrl: '/' })
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
			<SubmitButton
				stretch
				className='mt-8'
				pendingContent={<Loader text='Please wait...' />}
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

function validateForm(
	setFormFields: Dispatch<SetStateAction<FormField[]>>,
	formData: FormData
) {
	// client-side validation
	const validationResult = RegisterValidation.safeParse({
		username: formData.get('username'),
		email: formData.get('email'),
		password: formData.get('password')
	})

	// clear previous errors
	setFormFields(prevFields =>
		prevFields.map(field => ({ ...field, errors: [] }))
	)

	// display new errors, if there are any
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
	return validationResult
}

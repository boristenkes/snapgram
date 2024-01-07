'use client'

import Image from 'next/image'
import { Button, Input } from '../elements'
import { registerUser } from '@/lib/actions/user.actions'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { signIn } from 'next-auth/react'
import { RegisterValidation } from '@/lib/validations/user'
import { FormField } from '@/lib/types'
import SubmitButton from '../elements/SubmitButton'
import Loader from '../Loader'
import ServerErrorMessage from '../ServerErrorMessage'

const fields: FormField[] = [
	{
		type: 'text',
		name: 'username',
		label: 'username',
		required: true,
		errors: []
	},
	{
		type: 'text',
		name: 'name',
		label: 'name',
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
	},
	{
		type: 'password',
		name: 'confirmPassword',
		label: 'Confirm Password',
		required: true,
		errors: []
	}
]

export default function RegisterForm() {
	const [formFields, setFormFields] = useState<FormField[]>(fields)
	const [serverError, setServerError] = useState('')

	const clientAction = useCallback(
		async (formData: FormData) => {
			// client-side validation
			const validationResult = validateForm(setFormFields, formData)

			if (!validationResult) return

			// register user
			const response = await registerUser(validationResult.data)

			// display error occured in server validation, if there is one
			if (response?.error) {
				setServerError(response.error)
				return
			}

			// everything went well, sign in new user
			const { email, password } = validationResult.data
			signIn('credentials', { email, password, callbackUrl: '/' })
		},
		[registerUser, signIn]
	)

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
			{serverError && <ServerErrorMessage message={serverError} />}
			<SubmitButton
				stretch
				className='mt-8'
				pendingContent={<Loader text='Please wait...' />}
			>
				Register
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
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
		confirmPassword: formData.get('confirmPassword')
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

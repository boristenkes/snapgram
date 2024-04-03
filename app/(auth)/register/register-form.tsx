'use client'

import Image from 'next/image'
import { Button, TextInput } from '@/components/elements'
import { createUser } from '@/lib/actions/user.actions'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { signIn } from 'next-auth/react'
import { registerUserSchema } from '@/lib/validations/user'
import { FormField } from '@/lib/types'
import SubmitButton from '@/components/elements/submit-button'
import Loader from '@/components/loader'
import ErrorMessage from '@/components/error-message'

const fields: FormField[] = [
	{
		type: 'email',
		name: 'email',
		label: 'email',
		required: true
	},
	{
		type: 'password',
		name: 'password',
		label: 'password',
		required: true
	},
	{
		type: 'password',
		name: 'confirmPassword',
		label: 'Confirm Password',
		required: true
	}
]

export default function RegisterForm() {
	const [formFields, setFormFields] = useState<FormField[]>(fields)
	const [serverError, setServerError] = useState('')

	const clientAction = useCallback(
		async (formData: FormData) => {
			// client-side validation
			const formObj = {
				email: formData.get('email'),
				password: formData.get('password'),
				confirmPassword: formData.get('confirmPassword')
			} as Record<string, string>

			const validationResult = validateForm(formObj, setFormFields)

			if (!validationResult) return

			const { email, password } = formObj

			try {
				const response = await createUser({ email, password })

				setServerError(response?.error || '')
				if (response?.error) return

				await signIn('credentials', {
					email: validationResult.data.email,
					password: validationResult.data.password,
					callbackUrl: '/onboarding'
				})
			} catch (error) {
				console.log('Failed to create user:', error)
			}
		},
		[createUser, signIn]
	)

	return (
		<form
			action={clientAction}
			noValidate
		>
			{formFields.map(field => (
				<TextInput
					key={field.name}
					className='mt-6'
					{...field}
				/>
			))}
			{serverError && <ErrorMessage message={serverError} />}
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
	formObj: Record<string, string>,
	setFormFields: Dispatch<SetStateAction<FormField[]>>
) {
	// client-side validation
	const validationResult = registerUserSchema.safeParse(formObj)

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

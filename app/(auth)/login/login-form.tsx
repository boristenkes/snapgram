'use client'

import { Button, TextInput } from '@/components/elements'
import Image from 'next/image'
import { loginUserSchema } from '@/lib/validations/user'
import { Dispatch, SetStateAction, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
	}
]

export default function LoginForm() {
	const router = useRouter()
	const [formFields, setFormFields] = useState<FormField[]>(fields)
	const [serverError, setServerError] = useState('')

	const clientAction = async (formData: FormData) => {
		const validationResult = validateForm(setFormFields, formData)

		if (!validationResult) return

		const { email, password } = validationResult.data

		const fieldsBeforeReset = formFields
		const res = await signIn('credentials', {
			redirect: false,
			email,
			password
		})
		if (!res?.error) {
			router.push('/')
		} else {
			setServerError(res.error ?? 'Invalid email or password')
			setFormFields(fieldsBeforeReset) // prevent form reset
		}
	}

	return (
		<form
			action={clientAction}
			noValidate
		>
			{formFields.map(field => (
				<TextInput
					key={field.name}
					{...field}
				/>
			))}
			{serverError && <ErrorMessage message={serverError} />}
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
	const validationResult = loginUserSchema.safeParse({
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

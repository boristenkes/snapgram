'use client'

import { Button, Input } from '../elements'
import Image from 'next/image'
import { LoginValidation } from '@/lib/validations/user'
import { Dispatch, SetStateAction, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/lib/types'
import SubmitButton from '../elements/SubmitButton'
import Loader from '../Loader'
import ServerErrorMessage from '../ServerErrorMessage'

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
			setServerError('Invalid email or password')
			setFormFields(fieldsBeforeReset) // prevent form reset
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
			{serverError && <ServerErrorMessage message={serverError} />}
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
	const validationResult = LoginValidation.safeParse({
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

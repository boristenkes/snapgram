'use client'

import { Button, Input } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import Loader from '@/components/loader'
import ServerErrorMessage from '@/components/server-error-message'
import { onboard } from '@/lib/actions/user.actions'
import clientSession from '@/lib/client-session'
import { FormField } from '@/lib/types'
import { onboardingSchema } from '@/lib/validations/user'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const fields: FormField[] = [
	{
		name: 'name',
		label: 'Full name'
	},
	{
		name: 'username',
		label: 'Username'
	},
	{
		name: 'bio',
		label: 'Bio (optional)',
		textarea: true,
		textareaProps: {
			rows: 6
		}
	}
]

export default function OnboardingForm() {
	const { user: currentUser } = clientSession()
	const [formFields, setFormFields] = useState<FormField[]>(fields)
	const [serverError, setServerError] = useState('')

	const clientAction = async (formData: FormData) => {
		const formObj = {
			name: formData.get('name'),
			username: formData.get('username'),
			bio: formData.get('bio')
		} as Record<string, string>

		const validationResult = validateForm(formObj, setFormFields)

		if (!validationResult?.success) return

		const response = await onboard(currentUser._id, {
			...validationResult.data
		})

		if (response?.error) {
			setServerError(response.error)
			return
		} else {
			setServerError('')
			redirect('/')
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
					defaultValue={currentUser[field.name]}
					{...field}
				/>
			))}

			{serverError && <ServerErrorMessage message={serverError} />}

			<div className='flex justify-between items-center mt-8'>
				{/* TODO: Finish "Back" button */}
				<Button
					variant='dark'
					onClick={() => signOut()}
				>
					<Image
						src='/assets/icons/arrow-left.svg'
						alt=''
						width={16}
						height={17}
					/>
					Back
				</Button>
				<SubmitButton
					pendingContent={<Loader text={'Please wait...'} />}
					size='sm'
				>
					Continue to Snapgram
				</SubmitButton>
			</div>
		</form>
	)
}

function validateForm(
	formObj: Record<string, string>,
	setFormFields: React.Dispatch<React.SetStateAction<FormField[]>>
) {
	// client-side validation
	const validationResult = onboardingSchema.safeParse(formObj)

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

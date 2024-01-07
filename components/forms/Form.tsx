'use client'

import { FormField } from '@/lib/types'
import React, { useState } from 'react'
import { ZodObject } from 'zod'

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
	action: (...args: any[]) => Promise<{ error: string } | undefined>
	validation: ZodObject<{}>
	fieldNames: string[]
	setFormFields: React.Dispatch<React.SetStateAction<FormField[]>>
	onSuccess: (...args: any[]) => void
	children: React.ReactNode
}

type ValidationObject = Record<string, FormDataEntryValue | null>

export default function Form({
	action,
	validation,
	fieldNames,
	setFormFields,
	onSuccess,
	children
}: FormProps) {
	const [serverError, setServerError] = useState('')

	const clientAction = async (formData: FormData) => {
		const validationObject: ValidationObject = {}

		fieldNames.forEach(fieldName => {
			validationObject[fieldName] = formData.get(fieldName)
		})

		const validationResult = validation.safeParse(validationObject)

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

		const response = await action()

		if (response?.error) {
			setServerError(response.error)
			return { error: response.error }
		}

		onSuccess()
	}

	return (
		<form
			noValidate
			action={clientAction}
		>
			{children}
		</form>
	)
}

// function validateForm(
// 	setFormFields: Dispatch<SetStateAction<FormField[]>>,
// 	formData: FormData
// ) {
// 	// client-side validation
// 	const validationResult = RegisterValidation.safeParse({
// 		username: formData.get('username'),
// 		email: formData.get('email'),
// 		password: formData.get('password')
// 	})

// 	// clear previous errors
// 	setFormFields(prevFields =>
// 		prevFields.map(field => ({ ...field, errors: [] }))
// 	)

// 	// display new errors, if there are any
// 	if (!validationResult.success) {
// 		const formattedErrors = validationResult.error.format()

// 		setFormFields(prevFields =>
// 			prevFields.map(field => ({
// 				...field,
// 				// @ts-ignore
// 				errors: formattedErrors[field.name]?._errors || []
// 			}))
// 		)
// 		return
// 	}
// 	return validationResult
// }

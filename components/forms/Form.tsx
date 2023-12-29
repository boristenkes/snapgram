import Image from 'next/image'
import React from 'react'
import toast from 'react-hot-toast'
import { ZodObject } from 'zod'

type FormProps = {
	action: () => { error: string }
	validation: ZodObject<{}>
	fieldNames: string[]
	onSuccess: () => void
	children: React.ReactNode
}

type ValidationObject = {
	[key: string]: FormDataEntryValue | null
}

/*
@param action = server action that should be executed when client-side validation is passed
@param validation = zod object validation for formData
@param fieldNames = names of every input field in form
@param onSuccess = function executed when both client and server-side validation are passed
@param children = children of form element (should contain inputs, submit buttons etc...)
*/

export default function Form({
	action,
	validation,
	fieldNames,
	onSuccess,
	children
}: FormProps) {
	const clientAction = async (formData: FormData) => {
		const validationObject: ValidationObject = {}
		fieldNames.forEach(fieldName => {
			validationObject[fieldName] = formData.get(fieldName)
		})
		const validationResult = validation.safeParse(validationObject)

		if (!validationResult.success) {
			return validationResult.error.format()
		}

		const response = action()
		if (response?.error) {
			toast('Server Error: ' + response.error, {
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
			return
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

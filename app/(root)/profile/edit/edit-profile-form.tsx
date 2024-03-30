'use client'

import { FormField } from '@/lib/types'
import { useCallback, useState } from 'react'
import { TextInput } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import Loader from '@/components/loader'
import { updateUser } from '@/lib/actions/user.actions'
import { editProfileSchema } from '@/lib/validations/user'
import { id, megabytesToBytes } from '@/lib/utils'
import darkToast from '@/lib/toast'
import ErrorMessage from '@/components/error-message'
import Dropzone from '@/components/dropzone'

const fields: FormField[] = [
	{
		type: 'text',
		name: 'username',
		label: 'Username'
	},
	{
		type: 'text',
		name: 'name',
		label: 'Name'
	},
	{
		type: 'email',
		name: 'email',
		label: 'Email'
	},
	{
		name: 'bio',
		label: 'Bio'
	}
]

type EditProfileFormProps = {
	profile: string
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
	const currentUser = JSON.parse(profile)
	const [formFields, setFormFields] = useState<FormField[]>(fields)
	const [serverError, setServerError] = useState('')
	const [profilePicture, setAvatar] = useState<File[]>([])

	const clientAction = useCallback(
		async (formData: FormData) => {
			const pic = profilePicture[0]
			formData.set(
				'image',
				new File([pic], pic.name, {
					type: pic.type
				})
			)

			const validationResult = editProfileSchema.safeParse({
				username: formData.get('username'),
				name: formData.get('name'),
				email: formData.get('email'),
				bio: formData.get('bio')
			})

			// clear previous errors
			setFormFields(prevFields =>
				prevFields.map(field => ({ ...field, errors: [] }))
			)

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

			// const response = await updateUser({ _id: currentUser._id, formData })
			const response = await updateUser({
				_id: currentUser._id,
				formData,
				...validationResult.data
			})

			if (response.success) {
				darkToast(response.message)
			} else {
				setServerError(response.message)
			}
		},
		[currentUser, updateUser]
	)

	return (
		<form
			action={clientAction}
			noValidate
			className='max-w-2xl mt-14'
		>
			<Dropzone
				endpoint='profilePicture'
				name='image'
				dropzoneOptions={{
					onDrop: acceptedFiles => setAvatar(acceptedFiles),
					maxSize: megabytesToBytes(2),
					maxFiles: 1
				}}
				initialPreviews={
					currentUser.image && [
						{
							id: id(),
							url: currentUser.image,
							alt: currentUser.name
						}
					]
				}
			/>
			{formFields.map(field => (
				<TextInput
					key={field.name}
					textarea={field.name === 'bio'}
					textareaProps={{
						rows: 6,
						defaultValue: currentUser.bio
					}}
					defaultValue={currentUser[field.name]}
					className='mt-5'
					{...field}
				/>
			))}

			{serverError && <ErrorMessage message={serverError} />}

			<SubmitButton
				pendingContent={<Loader text='Updating profile...' />}
				size='sm'
				className='mt-10 ml-auto'
			>
				Update Profile
			</SubmitButton>
		</form>
	)
}

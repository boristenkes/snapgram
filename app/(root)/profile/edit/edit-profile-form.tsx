'use client'

// TODO: Don't submit form if data hasn't changed
// TODO: Handle photo remove
import { FormField } from '@/lib/types'
import { useCallback, useState } from 'react'
import { Input } from '../../../../components/elements'
import SubmitButton from '../../../../components/elements/SubmitButton'
import Loader from '../../../../components/Loader'
import { updateUser } from '@/lib/actions/user.actions'
import { EditProfileValidation } from '@/lib/validations/user'
import { validateImage } from '@/lib/utils'
import darkToast from '@/lib/toast'
import ServerErrorMessage from '../../../../components/ServerErrorMessage'
import ProfilePictureUploader from './profile-picture-uploader'

const fields: FormField[] = [
	{
		type: 'image',
		name: 'image',
		label: 'Change profile photo',
		errors: []
	},
	{
		type: 'text',
		name: 'username',
		label: 'Username',
		errors: []
	},
	{
		type: 'text',
		name: 'name',
		label: 'Name',
		errors: []
	},
	{
		type: 'email',
		name: 'email',
		label: 'Email',
		errors: []
	},
	{
		name: 'bio',
		label: 'Bio',
		errors: []
	}
]

type EditProfileFormProps = {
	profile: string
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
	const currentUser = JSON.parse(profile)
	const [formFields, setFormFields] = useState<FormField[]>(fields)
	const [imageBlob, setImageBlob] = useState('')
	const [imageErrors, setImageErrors] = useState<string[]>([])
	const [serverError, setServerError] = useState('')
	const [isFormEdited, setIsFormEdited] = useState(false)

	const handleImageChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setImageErrors([])

			const fileReader = new FileReader()

			if (e.target.files?.length) {
				const file = e.target.files[0]

				const imageValidation = validateImage(file)

				setImageErrors(imageValidation.errors)
				if (!imageValidation.success) return

				fileReader.onload = async event => {
					setImageBlob(event.target?.result?.toString() || '')
					setIsFormEdited(true)
				}

				fileReader.readAsDataURL(file)
			}
		},
		[]
	)

	const clientAction = useCallback(
		async (formData: FormData) => {
			if (!isFormEdited) return

			const validationResult = EditProfileValidation.safeParse({
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

			setServerError(response?.error || '')
			if (response?.success) {
				darkToast(response.success)
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
			{formFields.map(field =>
				field.type === 'image' ? (
					<ProfilePictureUploader
						key={field.name}
						imageBlob={imageBlob}
						imageErrors={imageErrors}
						imageHandler={handleImageChange}
						defaultImage={currentUser[field.name]}
					/>
				) : (
					<Input
						key={field.name}
						textarea={field.name === 'bio'}
						textareaProps={{
							rows: 6,
							defaultValue: currentUser.bio
						}}
						defaultValue={currentUser[field.name]}
						onInput={() => setIsFormEdited(true)}
						{...field}
					/>
				)
			)}

			{serverError && <ServerErrorMessage message={serverError} />}

			<SubmitButton
				pendingContent={
					<Loader
						// text={isUploading ? 'Uploading image' : 'Updating profile...'}
						text={'Updating profile...'}
					/>
				}
				size='sm'
				className='ml-auto mt-10'
				disabled={!isFormEdited}
			>
				Update Profile
			</SubmitButton>
		</form>
	)
}

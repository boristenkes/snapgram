'use client'

import { useState } from 'react'
import { TextInput, Textarea } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import Loader from '@/components/loader'
import { updateUser } from '@/lib/actions/user.actions'
import { EditProfileFields, editProfileSchema } from '@/lib/zod/user.schema'
import { id, megabytesToBytes } from '@/lib/utils'
import toast from '@/lib/toast'
import ErrorMessage from '@/components/error-message'
import Dropzone from '@/components/dropzone'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserProfile } from '@/lib/types'

export default function EditProfileForm({ profile }: { profile: UserProfile }) {
	const currentUser = profile
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<EditProfileFields>({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			username: currentUser.username,
			name: currentUser.name,
			email: currentUser.email,
			bio: currentUser.bio
		}
	})
	const [profilePicture, setProfilePicture] = useState<File[]>([])

	const onSubmit: SubmitHandler<EditProfileFields> = async data => {
		const pic = profilePicture[0]
		const formData = new FormData()

		if (pic) {
			formData.set(
				'image',
				new File([pic], pic.name, {
					type: pic.type
				})
			)
		}

		const response = await updateUser({
			userId: currentUser._id,
			formData,
			...data
		})

		if (response.success) {
			toast(response.message)
		} else {
			setError('root', { message: response.message })
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			className='max-w-2xl mt-14'
		>
			<Dropzone
				endpoint='profilePicture'
				name='image'
				dropzoneOptions={{
					onDrop: acceptedFiles => setProfilePicture(acceptedFiles),
					maxSize: megabytesToBytes(2),
					maxFiles: 1
				}}
				// @ts-ignore TODO
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
			<TextInput
				type='username'
				label='Username'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.username?.message}
				{...register('username')}
			/>
			<TextInput
				type='name'
				label='Name'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.name?.message}
				{...register('name')}
			/>
			<TextInput
				type='email'
				label='Email'
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.email?.message}
				{...register('email')}
			/>
			<Textarea
				label='Bio (optional)'
				rows={6}
				className='mt-6'
				disabled={isSubmitting}
				errors={errors.bio?.message}
				{...register('bio')}
			/>

			{errors.root && <ErrorMessage message={errors.root.message} />}

			<SubmitButton
				pendingContent={<Loader text='Updating profile...' />}
				size='sm'
				className='mt-10 ml-auto'
				disabled={isSubmitting}
			>
				Update Profile
			</SubmitButton>
		</form>
	)
}

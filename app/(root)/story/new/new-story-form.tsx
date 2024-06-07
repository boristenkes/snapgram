'use client'

import Dropzone from '@/components/dropzone'
import { TextInput } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import ErrorMessage from '@/components/error-message'
import Loader from '@/components/loader'
import { createStory } from '@/lib/actions/story.actions'
import toast from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Mention } from './mention-input'
import MentionInput from './mention-input'
import TagInput from './tag-input'

export default function NewStoryForm() {
	const router = useRouter()
	const [content, setContent] = useState<File | null>(null)
	const [mentions, setMentions] = useState<Mention[]>([])
	const [tags, setTags] = useState<string[]>([])
	const [error, setError] = useState('')

	const clientAction = async (formData: FormData) => {
		if (!content) {
			setError('You need to provide some content')
			return
		}

		formData.set(
			'content',
			new File([content], content.name, {
				type: content.type
			})
		)

		const response = await createStory({ formData, mentions, tags })
		if (response.success) {
			toast(response.message)
			router.push('/')
		} else {
			setError(response.message)
		}
	}

	return (
		<form
			action={clientAction}
			className='max-w-2xl'
		>
			{error && <ErrorMessage message={error} />}
			<div className='mb-8'>
				<Dropzone
					dropzoneOptions={{
						onDrop: acceptedFiles => setContent(acceptedFiles[0]),
						maxFiles: 1
					}}
					endpoint='storyContent'
					name='content'
					label='Drag and drop content here or click to browse files'
				/>
			</div>

			<MentionInput
				mentions={mentions}
				setMentions={setMentions}
			/>

			<TagInput
				tags={tags}
				setTags={setTags}
			/>

			<TextInput
				name='alt'
				label='Alt text'
				className='mt-6 mb-8 gap-1'
				description='Alt text describes your photos for people with visual impairments.'
			/>

			<SubmitButton
				pendingContent={<Loader text='Uploading...' />}
				size='sm'
				className='ml-auto mt-8 transition-all'
			>
				Upload
			</SubmitButton>
		</form>
	)
}

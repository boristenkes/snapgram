'use client'

import SubmitButton from '@/components/elements/submit-button'
import Loader from '@/components/loader'
import TagInput from './tag-input'
import { createStory } from '@/lib/actions/story.actions'
import { useState } from 'react'
import Dropzone from '@/components/dropzone'

export default function NewStoryForm() {
	const [content, setContent] = useState<File[]>([])

	const clientAction = async (formData: FormData) => {
		content.forEach(file => {
			formData.append(
				'content',
				new File([file], file.name, {
					type: file.type
				})
			)
		})

		await createStory({ formData })
	}

	return (
		<form
			action={clientAction}
			className='max-w-2xl space-y-8'
		>
			<Dropzone
				dropzoneOptions={{
					maxFiles: 10
				}}
				endpoint='storyContent'
				name='content'
				setFiles={setContent}
			/>

			<TagInput />

			<SubmitButton
				pendingContent={<Loader text='Creating...' />}
				size='sm'
				className='ml-auto transition-all'
				disabled={!content.length}
			>
				Create
			</SubmitButton>
		</form>
	)
}

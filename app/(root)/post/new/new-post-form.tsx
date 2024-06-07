'use client'

import Dropzone from '@/components/dropzone'
import { TextInput, Textarea } from '@/components/elements'
import SubmitButton from '@/components/elements/submit-button'
import ErrorMessage from '@/components/error-message'
import Loader from '@/components/loader'
import { createPost } from '@/lib/actions/post.actions'
import toast from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import MentionInput, { Mention } from '../../story/new/mention-input'
import TagInput from '../../story/new/tag-input'

export default function NewPostForm() {
	const router = useRouter()
	const [content, setContent] = useState<File[] | null>(null)
	const [mentions, setMentions] = useState<Mention[]>([])
	const [tags, setTags] = useState<string[]>([])
	const [errorMessage, setErrorMessage] = useState('')

	const clientAction = async (formData: FormData) => {
		if (!content) {
			setErrorMessage('You must provide some content')
			return
		}

		content.forEach(file => {
			formData.append(
				'content',
				new File([file], file.name, {
					type: file.type
				})
			)
		})

		const response = await createPost({ formData, mentions, tags })

		if (response.success) {
			toast(response.message)
			router.push('/')
		} else {
			setErrorMessage(response.message)
		}
	}

	return (
		<form action={clientAction}>
			{errorMessage && <ErrorMessage message={errorMessage} />}

			<div className='mb-2'>
				<p className='mb-3'>Add Photos/Videos</p>
				<Dropzone
					endpoint='postContent'
					dropzoneOptions={{
						onDrop: acceptedFiles => setContent(acceptedFiles.slice(0, 10)),
						maxFiles: 10
					}}
					label='Drag and drop content here or click to browse files'
				/>
				<p className='ml-auto mt-2 text-sm w-fit'>
					{content?.length ?? 0} / 10
				</p>
			</div>

			<Textarea
				name='caption'
				label='Caption'
				className='mb-6'
			/>

			<div className='mb-2'>
				<MentionInput
					mentions={mentions}
					setMentions={setMentions}
				/>
			</div>

			<div className='mb-8'>
				<TagInput
					tags={tags}
					setTags={setTags}
				/>
			</div>

			<TextInput
				name='alt'
				label='Photo/Video Alt Text'
				description='Alt text describes your photos for people with visual impairments.'
				className='gap-0'
			/>

			<SubmitButton
				pendingContent={<Loader text='Sharing Post...' />}
				size='sm'
				className='ml-auto mt-8 transition-all'
			>
				Share Post
			</SubmitButton>
		</form>
	)
}

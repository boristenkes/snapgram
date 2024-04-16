'use client'

import { Post } from '@/lib/types'
import { TextInput, Textarea } from '@/components/elements'
import MentionInput, { Mention } from '@/app/(root)/story/new/mention-input'
import { useState } from 'react'
import TagInput from '@/app/(root)/story/new/tag-input'
import SubmitButton from '@/components/elements/submit-button'
import Loader from '@/components/loader'
import toast from '@/lib/toast'
import { updatePost } from '@/lib/actions/post.actions'

type EditPostFormProps = {
	post: Post
}

export default function EditPostForm({ post }: EditPostFormProps) {
	const [mentions, setMentions] = useState<Mention[]>(
		post.mentions as Mention[]
	)
	const [tags, setTags] = useState<string[]>(post.tags)

	const clientAction = async (formData: FormData) => {
		const caption = formData.get('caption') as string
		const altText = formData.get('alt') as string

		const response = await updatePost({
			authorId: post.author.toString(),
			postId: post._id,
			caption,
			altText,
			mentions,
			tags
		})

		if (response.success) {
			toast(response.message)
		} else {
			toast(response.message, { type: 'error' })
		}
	}

	return (
		<form
			action={clientAction}
			noValidate
		>
			<Textarea
				defaultValue={post.caption}
				name='caption'
				label='Caption'
				className='my-6'
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
				defaultValue={post.altText}
				name='alt'
				label='Photo/Video Alt Text'
				description='Alt text describes your photos for people with visual impairments.'
				className='gap-0'
			/>

			<SubmitButton
				pendingContent={<Loader text='Saving changes...' />}
				size='sm'
				className='ml-auto mt-8 transition-all'
			>
				Save changes
			</SubmitButton>
		</form>
	)
}

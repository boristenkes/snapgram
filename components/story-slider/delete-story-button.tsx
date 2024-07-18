'use client'

import { deleteStory } from '@/lib/actions/story.actions'
import toast from '@/lib/toast'
import { redirect } from 'next/navigation'
import SubmitButton from '../elements/submit-button'
import Loader from '../loader'

type DeleteStoryButtonProps = {
	storyId: string
}

export default function DeleteStoryButton({ storyId }: DeleteStoryButtonProps) {
	const handleDeleteStorySubmit = async () => {
		const response = await deleteStory(storyId)

		toast(response.message, { type: response.success ? 'success' : 'error' })

		if (response.success) redirect('/')
	}

	return (
		<form action={handleDeleteStorySubmit}>
			<SubmitButton
				pendingContent={<Loader text='Deleting...' />}
				size='sm'
				className='text-sm gap-4 bg-transparent border-transparent hover:bg-neutral-600 transition-colors duration-200'
			>
				Delete
			</SubmitButton>
		</form>
	)
}

'use client'

import { togglePostSave } from '@/lib/actions/post.actions'
import toast from '@/lib/toast'
import Image from 'next/image'
import { useCallback, useOptimistic, useState } from 'react'

type SaveButtonProps = {
	currentUserId: string
	postId: string
	isSaved: boolean
}

export default function SaveButton({
	currentUserId,
	postId,
	isSaved
}: SaveButtonProps) {
	const [saved, setSaved] = useState(isSaved)
	const [optimisticSaved, setOptimisticSaved] = useOptimistic(saved)

	const toggleSave = useCallback(async () => {
		setOptimisticSaved(prev => !prev)

		const response = await togglePostSave({ currentUserId, postId })

		if (!response.success) {
			setSaved(saved)
			toast(response.message, { type: 'error' })
			return
		}

		setSaved(prev => !prev)
	}, [saved, setSaved, optimisticSaved, setOptimisticSaved, togglePostSave])

	return (
		<form action={toggleSave}>
			<button
				type='submit'
				className='flex items-center gap-2'
			>
				<Image
					src={
						optimisticSaved
							? '/assets/icons/save-active.svg'
							: '/assets/icons/save-primary.svg'
					}
					alt={optimisticSaved ? 'Dissave Post' : 'Save Post'}
					width={20}
					height={20}
					className='w-5 h-5'
				/>
			</button>
		</form>
	)
}

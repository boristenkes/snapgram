'use client'

import Avatar from '../avatar'
import Image from 'next/image'
import { createComment } from '@/lib/actions/comment.actions'
import toast from '@/lib/toast'
import clientSession from '@/lib/client-session'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function CommentInput({ postId }: { postId: string }) {
	const { user: currentUser } = clientSession()
	const inputRef = useRef<HTMLInputElement>(null)
	const pathname = usePathname()

	const clientAction = async (formData: FormData) => {
		const content = formData.get('content') as string
		if (!content.trim().length) return

		const response = await createComment({
			content,
			postId,
			pathname
		})

		if (response.success) {
			toast(response.message)
		} else {
			toast(response.message, { type: 'error' })
		}

		if (inputRef.current) inputRef.current.value = ''
	}

	return (
		<form
			action={clientAction}
			className='flex items-center gap-3'
		>
			<Avatar
				url={currentUser.image}
				alt={currentUser.name}
				width={40}
				height={40}
			/>
			<div className='bg-neutral-700 flex items-center py-3 px-4 rounded-lg flex-1'>
				<input
					type='text'
					name='content'
					autoComplete='off'
					className='outline-none border-none bg-transparent flex-1 placeholder-neutral-300 mr-3 w-full'
					placeholder='Write your comment...'
					ref={inputRef}
				/>
				<button
					type='submit'
					className='flex-none'
				>
					<Image
						src='/assets/icons/send.svg'
						alt='Comment'
						width={20}
						height={19}
					/>
					<span className='sr-only'>Post comment</span>
				</button>
			</div>
		</form>
	)
}

'use client'

import useAuth from '@/hooks/use-auth'
import { createComment } from '@/lib/actions/comment.actions'
import toast from '@/lib/toast'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import Avatar from '../avatar'
import SubmitButton from '../elements/submit-button'

export default function CommentInput({
	postId,
	className
}: {
	postId: string
	className?: string
}) {
	const { user: currentUser } = useAuth()
	const inputRef = useRef<HTMLInputElement>(null)
	const pathname = usePathname()

	const clientAction = async (formData: FormData) => {
		const content = formData.get('content') as string
		if (!content?.trim().length) return

		if (inputRef.current) {
			inputRef.current.value = ''
			inputRef.current.disabled = true
		}

		const response = await createComment({
			content,
			postId,
			pathname
		})

		toast(response.message, { type: response.success ? 'success' : 'error' })

		if (inputRef.current) inputRef.current.disabled = false
	}

	return (
		<form
			action={clientAction}
			className={cn('flex items-center gap-3', className)}
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
					className='outline-none border-none bg-transparent flex-1 placeholder-neutral-300 mr-3 w-full disabled:opacity-50'
					placeholder='Write your comment...'
					ref={inputRef}
				/>
				<SubmitButton
					type='submit'
					className='p-0 bg-transparent border-transparent flex-none disabled:opacity-50'
				>
					<Image
						src='/assets/icons/send.svg'
						alt='Comment'
						width={20}
						height={19}
					/>
					<span className='sr-only'>Post comment</span>
				</SubmitButton>
			</div>
		</form>
	)
}

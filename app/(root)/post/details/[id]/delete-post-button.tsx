'use client'

import Image from 'next/image'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { deletePost } from '@/lib/actions/post.actions'
import toast from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'

type DeletePostButtonProps = {
	currentUserId: string
	targetPostId: string
}

export default function DeletePostButton({
	currentUserId,
	targetPostId
}: DeletePostButtonProps) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleDelete = async () => {
		setLoading(true)

		const response = await deletePost(currentUserId, targetPostId)

		if (response.success) {
			toast(response.message)
			router.replace('/')
		} else {
			toast(response.message, { type: 'error' })
		}

		setLoading(false)
		setOpen(false)
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={setOpen}
		>
			<AlertDialogTrigger>
				<Image
					src='/assets/icons/trash.svg'
					alt='Delete post'
					width={21}
					height={21}
				/>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Post</AlertDialogTitle>
					<AlertDialogDescription>
						Are you absolutely sure? This action cannot be undone. This will
						permamently delete your post and remove its data from our servers
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={loading}
					>
						{loading && <Loader className='mr-2' />}{' '}
						{loading ? 'Deleting...' : 'Delete'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

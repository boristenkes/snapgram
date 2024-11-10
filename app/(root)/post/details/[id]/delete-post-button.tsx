'use client'

import Loader from '@/components/loader'
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
import { Button } from '@/components/ui/button'
import { deletePost } from '@/lib/actions/post.actions'
import toast from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
			<AlertDialogTrigger aria-label='Delete post'>
				<svg
					width={20}
					height={20}
					viewBox='0 0 20 20'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M4.26389 6.45969C4.6083 6.43673 4.90612 6.69732 4.92908 7.04173L5.31236 12.791C5.38724 13.9142 5.4406 14.6957 5.55774 15.2837C5.67136 15.8541 5.82998 16.156 6.05782 16.3692C6.28566 16.5823 6.59746 16.7205 7.17413 16.796C7.76863 16.8737 8.55197 16.875 9.67767 16.875H10.3221C11.4478 16.875 12.2312 16.8737 12.8257 16.796C13.4024 16.7205 13.7142 16.5823 13.942 16.3692C14.1698 16.156 14.3284 15.8541 14.4421 15.2837C14.5592 14.6957 14.6126 13.9142 14.6875 12.791L15.0707 7.04173C15.0937 6.69732 15.3915 6.43673 15.7359 6.45969C16.0803 6.48265 16.3409 6.78047 16.318 7.12488L15.9318 12.918C15.8605 13.987 15.803 14.8504 15.668 15.5279C15.5277 16.2324 15.289 16.8208 14.796 17.282C14.303 17.7432 13.7 17.9422 12.9878 18.0354C12.3028 18.125 11.4374 18.125 10.3661 18.125H9.63373C8.5624 18.125 7.69703 18.125 7.012 18.0354C6.29979 17.9422 5.69684 17.7432 5.20384 17.282C4.71084 16.8208 4.47216 16.2324 4.33183 15.5279C4.19685 14.8504 4.1393 13.9869 4.06805 12.918L3.68185 7.12488C3.65889 6.78047 3.91948 6.48265 4.26389 6.45969Z'
						fill='#FF5050'
					/>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M8.62929 1.87497L8.59097 1.87495C8.41065 1.87484 8.25354 1.87474 8.10519 1.89843C7.51911 1.99202 7.01195 2.35756 6.73782 2.88397C6.66844 3.01722 6.61885 3.1663 6.56194 3.33741L6.54984 3.37376L6.46893 3.61647C6.45311 3.66395 6.44869 3.67703 6.44486 3.68764C6.29892 4.09107 5.92057 4.36377 5.4917 4.37464C5.48042 4.37492 5.46661 4.37497 5.41657 4.37497H2.9165C2.57133 4.37497 2.2915 4.65479 2.2915 4.99997C2.2915 5.34515 2.57133 5.62497 2.9165 5.62497L5.42371 5.62497L5.43766 5.62497H14.5622L14.5761 5.62497L17.0832 5.62497C17.4284 5.62497 17.7082 5.34515 17.7082 4.99997C17.7082 4.65479 17.4284 4.37497 17.0832 4.37497H14.5832C14.5332 4.37497 14.5194 4.37492 14.5081 4.37464C14.0792 4.36377 13.7009 4.09105 13.5549 3.68762C13.5511 3.67709 13.5466 3.66371 13.5309 3.61647L13.45 3.37376L13.4379 3.33739C13.381 3.16628 13.3314 3.01721 13.262 2.88397C12.9879 2.35756 12.4807 1.99202 11.8946 1.89843C11.7463 1.87474 11.5892 1.87484 11.4088 1.87495L11.3705 1.87497H8.62929ZM7.62032 4.11284C7.58759 4.20331 7.54955 4.29079 7.50663 4.37497H12.4932C12.4503 4.29079 12.4122 4.20332 12.3795 4.11286L12.3472 4.0184L12.2641 3.76904C12.1881 3.54111 12.1707 3.49463 12.1533 3.4613C12.0619 3.28583 11.8929 3.16399 11.6975 3.13279C11.6604 3.12687 11.6108 3.12497 11.3705 3.12497H8.62929C8.38903 3.12497 8.33941 3.12687 8.3023 3.13279C8.10694 3.16399 7.93789 3.28583 7.84651 3.4613C7.82916 3.49463 7.81167 3.54112 7.73569 3.76904L7.65252 4.01855C7.64 4.05612 7.63025 4.08537 7.62032 4.11284Z'
						fill='#FF5050'
					/>
				</svg>
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

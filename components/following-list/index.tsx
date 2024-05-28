'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../ui/dialog'
import { fetchUser, unfollow } from '@/lib/actions/user.actions'
import { User } from '@/lib/types'
import ErrorMessage from '../error-message'
import UserCard from '../user-card'
import UserCardListSkeleton from '../skeletons/user-card-list'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import useAuth from '@/hooks/use-auth'
import Image from 'next/image'

type Props = {
	userId: string
	isUserPrivate: boolean
	followingCount: number
	children: React.ReactNode
}

export default function FollowingList({
	userId,
	isUserPrivate,
	followingCount,
	children
}: Props) {
	const { user: currentUser } = useAuth()
	const isCurrentUserFollower = (currentUser.following as string[]).includes(
		userId
	)
	const isCurrentUser = currentUser._id === userId

	if (isUserPrivate && !isCurrentUserFollower && !isCurrentUser) return children

	const [data, setData] = useState({
		isOpen: false,
		fetched: false,
		error: '',
		following: [] as (User & { unfollowPending?: boolean })[],
		loading: false
	})

	const handleOpenChange = async (open: boolean) => {
		setData(prev => ({ ...prev, isOpen: open }))

		if (data.fetched) return

		setData(prev => ({ ...prev, loading: true }))

		const response = await fetchUser(
			{ _id: userId },
			{
				select: 'following',
				populate: ['following', 'image name username']
			}
		)

		if (!response.success) {
			setData(prev => ({
				...prev,
				error: response.message,
				loading: false
			}))
			return
		}

		setData(prev => ({
			...prev,
			following: response.user.following as User[],
			error: '',
			fetched: true,
			loading: false
		}))
	}

	const handleUnfollowClick = async (followerId: string) => {
		if (currentUser._id !== userId) return

		setData(prev => ({
			...prev,
			following: prev.following.map(follower =>
				follower._id === followerId
					? {
							...follower,
							unfollowPending: true
					  }
					: follower
			)
		}))

		const formData = new FormData()
		formData.set('targetUserId', followerId)
		formData.set('currentUserId', userId)

		const response = await unfollow(formData)

		if (response?.error) {
			setData(prev => ({ ...prev, error: response.error }))
			return
		}

		const updatedFollowing = data.following.filter(
			follower => follower._id !== followerId
		)

		setData(prev => ({ ...prev, following: updatedFollowing }))
	}

	return (
		<Dialog
			onOpenChange={handleOpenChange}
			open={data.isOpen}
		>
			<DialogTrigger>{children}</DialogTrigger>
			{(data.isOpen || data.fetched) && (
				<DialogContent className='bg-neutral-800 w-[min(24rem,100%-2rem)] max-h-[90vh] h-fit mx-auto p-6 flex flex-col'>
					<DialogHeader>
						<div className='flex items-center justify-between'>
							<DialogTitle className='block mb-1'>Following</DialogTitle>
							<DialogClose asChild>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => setData(prev => ({ ...prev, isOpen: false }))}
									aria-label='Close'
								>
									<Image
										src='/assets/icons/close.svg'
										alt='Close'
										width={28}
										height={28}
									/>
								</Button>
							</DialogClose>
						</div>
					</DialogHeader>

					{data.error && <ErrorMessage message={data.error} />}

					{data.loading && (
						<UserCardListSkeleton
							cardCount={followingCount > 6 ? 6 : followingCount}
						/>
					)}

					{!data.loading && !data.following.length && (
						<p className='text-neutral-500 italic'>
							This user doesn't follow anyone.
						</p>
					)}

					{!data.loading && !!data.following.length && (
						<ul className='flex-grow min-h-1 h-full overflow-y-auto custom-scrollbar'>
							{data.following.map(follower => (
								<li
									key={follower._id}
									className={cn('flex items-center justify-between', {
										'opacity-50': follower?.unfollowPending
									})}
								>
									<UserCard user={follower} />

									{currentUser._id === userId && (
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleUnfollowClick(follower._id)}
											disabled={follower?.unfollowPending}
										>
											{follower?.unfollowPending
												? 'Unfollowing...'
												: 'Unfollow'}
										</Button>
									)}
								</li>
							))}
						</ul>
					)}
				</DialogContent>
			)}
		</Dialog>
	)
}

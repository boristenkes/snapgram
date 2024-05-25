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
import { fetchUser, removeFollower } from '@/lib/actions/user.actions'
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
	followersCount: number
	children: React.ReactNode
}

export default function FollowersList({
	userId,
	isUserPrivate,
	followersCount,
	children
}: Props) {
	const { user: currentUser } = useAuth()

	// @ts-ignore
	if (isUserPrivate && !currentUser.following.includes(userId)) return children

	const [data, setData] = useState({
		isOpen: false,
		fetched: false,
		error: '',
		followers: [] as (User & { removing?: boolean })[],
		loading: false
	})

	const handleOpenChange = async (open: boolean) => {
		setData(prev => ({ ...prev, isOpen: open }))

		if (data.fetched) return

		setData(prev => ({ ...prev, loading: true }))

		const response = await fetchUser(
			{ _id: userId },
			{
				select: 'followers',
				populate: ['followers', 'image name username']
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
			followers: response.user.followers as User[],
			fetched: true,
			loading: false
		}))
	}

	const handleRemoveFollowerClick = async (followerId: string) => {
		if (currentUser._id !== userId) return

		setData(prev => ({
			...prev,
			followers: prev.followers.map(follower =>
				follower._id === followerId
					? {
							...follower,
							removing: true
					  }
					: follower
			)
		}))

		const response = await removeFollower(userId, followerId)

		if (!response.success) {
			setData(prev => ({ ...prev, error: response.message }))
			return
		}

		const updatedFollowers = data.followers.filter(
			follower => follower._id !== followerId
		)

		setData(prev => ({ ...prev, followers: updatedFollowers }))
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
							<DialogTitle className='block mb-1'>Followers</DialogTitle>
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
							cardCount={followersCount > 6 ? 6 : followersCount}
						/>
					)}

					{!data.loading && !data.followers.length && (
						<p className='text-neutral-500 italic'>
							This user doesn't have any followers.
						</p>
					)}

					{!data.loading && !!data.followers.length && (
						<ul className='flex-grow min-h-1 h-full overflow-y-auto custom-scrollbar'>
							{data.followers.map(follower => (
								<li
									key={follower._id}
									className={cn('flex items-center justify-between', {
										'opacity-50': follower?.removing
									})}
								>
									<UserCard user={follower} />

									{currentUser._id === userId && (
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleRemoveFollowerClick(follower._id)}
											disabled={follower?.removing}
										>
											{follower?.removing ? 'Removing...' : 'Remove'}
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

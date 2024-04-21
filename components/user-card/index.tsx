'use client'

import { User } from '@/lib/types'
import Avatar from '../avatar'
import Link from 'next/link'
import FollowButton, { type FollowButtonProps } from '../follow-button'
import clientSession from '@/lib/client-session'

type UserCardProps = {
	user: User
	type?: 'list' | 'grid'
	withFollowButton?: boolean
	followButtonProps?: Omit<
		FollowButtonProps,
		'currentUserStr' | 'targetUserStr'
	>
}

export default function UserCard({
	user,
	type = 'list',
	withFollowButton = false,
	followButtonProps
}: UserCardProps) {
	const { user: currentUser } = clientSession()

	return (
		<div className='flex items-center justify-between w-full has-[:hover]:bg-neutral-600/50 rounded-md transition-colors duration-200'>
			<Link
				href={`/profile/${user.username}`}
				className='flex items-center gap-2 flex-1 p-2'
			>
				<Avatar
					url={user.image}
					width={40}
				/>
				<div className='flex-1 grid'>
					<strong>{user.name}</strong>
					<small className='text-neutral-500'>@{user.username}</small>
				</div>
			</Link>
			{withFollowButton && (
				<FollowButton
					currentUserStr={JSON.stringify(currentUser)}
					targetUserStr={JSON.stringify(user)}
					{...followButtonProps}
				/>
			)}
		</div>
	)
}

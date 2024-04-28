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

export default function UserCard({ user, type = 'list' }: UserCardProps) {
	return (
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
	)
}

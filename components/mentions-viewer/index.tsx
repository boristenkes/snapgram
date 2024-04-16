import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import Image from 'next/image'
import { fetchPost } from '@/lib/actions/post.actions'
import ErrorMessage from '../error-message'
import Link from 'next/link'
import Avatar from '../avatar'
import { User } from '@/lib/types'

export default async function MentionsViewer({ postId }: { postId: string }) {
	const response = await fetchPost(
		{ _id: postId },
		{
			populate: ['mentions', 'image username name'],
			select: 'mentions'
		}
	)

	return (
		<Popover>
			<PopoverTrigger className='absolute bottom-4 left-4 bg-neutral-800 p-2 aspect-square rounded-full'>
				<Image
					src='/assets/icons/user.svg'
					alt=''
					width={16}
					height={16}
				/>
			</PopoverTrigger>

			<PopoverContent side='top'>
				<strong className='block mb-1'>Mentioned users</strong>
				{response.success ? (
					<ul>
						{(response.post.mentions as User[]).map(user => (
							<li
								key={user.username}
								className='flex items-center justify-between has-[:hover]:bg-neutral-600/50 rounded-md transition-colors duration-200'
							>
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
							</li>
						))}
					</ul>
				) : (
					<ErrorMessage message={response.message} />
				)}
			</PopoverContent>
		</Popover>
	)
}

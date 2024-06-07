import { fetchPost } from '@/lib/actions/post.actions'
import { User } from '@/lib/types'
import Image from 'next/image'
import ErrorMessage from '../error-message'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import UserCard from '../user-card'

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
			<PopoverTrigger
				className='absolute bottom-4 left-4 bg-neutral-800 p-2 aspect-square rounded-full'
				aria-label='View mentioned users'
			>
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
							<li key={user.username}>
								<UserCard user={user} />
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

import { getCurrentUser } from '@/lib/session'
import Avatar from '../avatar'
import Image from 'next/image'
import Unavailable from '../unavailable'

export default async function CommentInput() {
	const { user: currentUser } = await getCurrentUser()

	return (
		<Unavailable>
			<form className='flex items-center gap-3'>
				<Avatar
					url={currentUser.image}
					alt={currentUser.name}
					width={40}
					height={40}
				/>
				<div className='bg-neutral-700 flex items-center py-3 px-4 rounded-lg flex-1'>
					<input
						type='text'
						name='comment'
						autoComplete='off'
						className='outline-none border-none bg-transparent flex-1 placeholder-neutral-300 mr-3 w-full'
						placeholder='Write your comment...'
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
		</Unavailable>
	)
}

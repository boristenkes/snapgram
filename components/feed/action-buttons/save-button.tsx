import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'

type SaveButtonProps = {
	postId: string
}

export default async function SaveButton({ postId }: SaveButtonProps) {
	const { user: currentUser } = await getCurrentUser()
	const isSaved = currentUser.savedPosts?.includes(postId)

	return (
		<form>
			<button
				type='submit'
				className='flex items-center gap-2'
			>
				<Image
					src={
						isSaved
							? '/assets/icons/save-active.svg'
							: '/assets/icons/save-primary.svg'
					}
					alt={isSaved ? 'Unsave post' : 'Save post'}
					width={20}
					height={20}
				/>
			</button>
		</form>
	)
}

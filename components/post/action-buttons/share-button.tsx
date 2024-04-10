import Unavailable from '@/components/unavailable'
import Image from 'next/image'

type ShareButtonProps = {
	currentUserId: string
	postId: string
	shareCount: number
}

export default function ShareButton({
	currentUserId,
	postId,
	shareCount
}: ShareButtonProps) {
	return (
		<Unavailable>
			<form>
				<button
					type='submit'
					className='flex items-center gap-2'
					aria-label='Share post'
				>
					<Image
						src='/assets/icons/share.svg'
						alt=''
						width={20}
						height={20}
					/>
					{shareCount}
				</button>
			</form>
		</Unavailable>
	)
}

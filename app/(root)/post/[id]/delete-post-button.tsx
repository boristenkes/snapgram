import Image from 'next/image'

type DeletePostButtonProps = {
	currentUserId: string
	targetPostId: string
}

export default function DeletePostButton({
	currentUserId,
	targetPostId
}: DeletePostButtonProps) {
	return (
		<div>
			<Image
				src='/assets/icons/trash.svg'
				alt='Delete post'
				width={20}
				height={20}
			/>
		</div>
	)
}

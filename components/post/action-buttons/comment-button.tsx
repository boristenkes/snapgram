import Image from 'next/image'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'
import CommentList from '@/components/comment-list'
import CommentInput from '../comment-input'

type CommentButtonProps = {
	postId: string
	commentCount: number
}

export default function CommentButton({
	postId,
	commentCount
}: CommentButtonProps) {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<button
					className='flex items-center gap-2'
					aria-label='View post comments'
				>
					<Image
						src='/assets/icons/comment.svg'
						alt=''
						width={20}
						height={20}
					/>
					{commentCount}
				</button>
			</DrawerTrigger>
			<DrawerContent className='h-[50vh]'>
				<DrawerHeader>
					<DrawerTitle className='text-center'>Comments</DrawerTitle>
				</DrawerHeader>
				<CommentList
					postId={postId}
					className='mx-auto py-4 w-[min(30rem,100%)] px-4'
				/>
				<CommentInput
					postId={postId}
					className='p-4 border-t border-t-neutral-600 w-[min(30rem,100%)] mx-auto'
				/>
			</DrawerContent>
		</Drawer>
	)
}

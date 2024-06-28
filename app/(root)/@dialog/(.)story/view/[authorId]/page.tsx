import StoryDetails from '@/app/(root)/story/view/[authorId]/story-details'
import Modal from '@/components/modal'
import StoryDetailsSkeleton from '@/components/skeletons/story-details'
import { Suspense } from 'react'

type Props = {
	params: {
		authorId: string
	}
}

export default function StoryViewModal({ params: { authorId } }: Props) {
	return (
		<Modal className='w-fit'>
			<Suspense fallback={<StoryDetailsSkeleton />}>
				<StoryDetails authorId={authorId} />
			</Suspense>
		</Modal>
	)
}

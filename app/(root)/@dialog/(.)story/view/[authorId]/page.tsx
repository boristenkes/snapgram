import StoryDetails from '@/app/(root)/story/view/[authorId]/story-details'
import Modal from '@/components/modal'
import StoryDetailsSkeleton from '@/components/skeletons/story-details'
import { SearchParams } from '@/lib/types'
import { Suspense } from 'react'

type Props = {
	params: {
		authorId: string
	}
	searchParams: SearchParams
}

export default function StoryViewModal({
	params: { authorId },
	searchParams
}: Props) {
	const index = (searchParams.index as string) ?? '0'
	const paused = !!searchParams.paused?.length

	return (
		<Modal className='w-fit'>
			<Suspense fallback={<StoryDetailsSkeleton />}>
				<StoryDetails
					authorId={authorId}
					index={parseInt(index)}
					paused={paused}
				/>
			</Suspense>
		</Modal>
	)
}

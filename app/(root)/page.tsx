import Feed from '@/components/feed'
import FeedSkeleton from '@/components/skeletons/feed'
import StoryBubbleTrack from '@/components/story-bubble-track'
import { Suspense } from 'react'
import RightSidebar from './right-sidebar'

export default function Home() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				{/* <StoryBubbleTrack /> */}
				{/* ⬇ temporary (mocks height of <StoryBubbleTrack />) */}
				<div className='py-4 lg:py-10' />

				<Suspense fallback={<FeedSkeleton />}>
					<Feed />
				</Suspense>
			</main>

			<RightSidebar />
		</div>
	)
}

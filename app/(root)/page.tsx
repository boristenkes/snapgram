import Feed from '@/components/feed'
import FeedSkeleton from '@/components/skeletons/feed'
import StoryBubbleTrackSkeleton from '@/components/skeletons/story-bubble-track'
import StoryBubbleTrack from '@/components/story-bubble-track'
import { Suspense } from 'react'
import RightSidebar from './right-sidebar'

export default function Home() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<Suspense fallback={<StoryBubbleTrackSkeleton />}>
					<StoryBubbleTrack />
				</Suspense>

				<Suspense fallback={<FeedSkeleton />}>
					<Feed />
				</Suspense>
			</main>

			<RightSidebar />
		</div>
	)
}

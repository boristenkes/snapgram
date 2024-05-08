import StoryBubbleTrack from '@/components/story-bubble-track'
import RightSidebar from './right-sidebar'
import Feed from '@/components/feed'

export default function Home() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				{/* <StoryBubbleTrack /> */}
				<div className='py-4 lg:py-10' /> {/* <- temporary */}
				<Feed />
			</main>

			<RightSidebar />
		</div>
	)
}

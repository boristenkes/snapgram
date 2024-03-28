import StoryBubbleTrack from '@/components/story-bubble-track'
import RightSidebar from './right-sidebar'

export default function Home() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<StoryBubbleTrack />
			</main>

			<RightSidebar />
		</div>
	)
}

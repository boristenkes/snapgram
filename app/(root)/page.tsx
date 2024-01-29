import StoryTrack from '@/components/story-track'
import RightSidebar from './right-sidebar'

export default function Home() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<StoryTrack />
			</main>

			<RightSidebar />
		</div>
	)
}

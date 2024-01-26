import Search from '@/components/search'
import StoryTrack from '@/components/story-track'

export default function Home() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<StoryTrack />
			</main>
			<aside className='h-screen w-full max-w-md px-6 py-14 position-sticky top-0 right-0 bg-neutral-800 border-l border-l-neutral-700'>
				<Search placeholder='Search users...' />
			</aside>
		</div>
	)
}

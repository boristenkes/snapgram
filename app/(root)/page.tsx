import Searchbar from '@/components/search'
import StoryTrack from '@/components/story-track'
import SuggestedAccounts from './suggested-accounts'

export default function Home() {
	return (
		<div className='flex'>
			<main className='flex-1'>
				<StoryTrack />
			</main>
			<aside className='position-sticky right-0 top-0 h-screen w-full max-w-sm border-l border-l-neutral-700 bg-neutral-800 px-6 py-14 hidden lg:block xl:max-w-md'>
				<Searchbar placeholder='Search users...' />
				<SuggestedAccounts />
			</aside>
		</div>
	)
}

import PopularTagsSkeleton from '@/components/skeletons/popular-tags'
import PostListSkeleton from '@/components/skeletons/post-list'
import { type SearchParams } from '@/lib/types'
import { Metadata } from 'next'
import { Suspense } from 'react'
import ExploreHeader from './explore-header'
import PopularTags from './popular-tags'
import SearchResults from './search-results'

export const metadata: Metadata = {
	title: 'Explore • Snapgram',
	description:
		'Explore and discover new posts on Snapgram. Search through public content and find new accounts to follow.'
}

export default async function ExplorePage({
	searchParams
}: {
	searchParams: SearchParams
}) {
	const searchTerm = (searchParams.search as string) ?? ''

	return (
		<div className='my-16'>
			<ExploreHeader searchTerm={searchTerm} />

			<Suspense fallback={<PopularTagsSkeleton />}>
				<PopularTags />
			</Suspense>

			<main className='w-[min(62.5rem,100%-2rem)] mx-auto'>
				<h1 className='text-2xl font-bold mt-20 sm:text-3xl'>Popular Today</h1>

				<Suspense fallback={<PostListSkeleton />}>
					<SearchResults searchTerm={searchTerm} />
				</Suspense>
			</main>
		</div>
	)
}

import ExploreHeader from './explore-header'
import PopularTags from './popular-tags'
import SearchResults from './search-results'

export default async function ExplorePage({
	searchParams
}: {
	searchParams: Record<string, string | string[] | undefined>
}) {
	const searchTerm = (searchParams.search as string) ?? ''

	return (
		<div className='my-16'>
			<ExploreHeader searchTerm={searchTerm} />
			<PopularTags />

			<main className='w-[min(62.5rem,100%-2rem)] mx-auto'>
				<h1 className='text-2xl font-bold mt-20 sm:text-3xl'>Popular Today</h1>

				<SearchResults searchTerm={searchTerm} />
			</main>
		</div>
	)
}

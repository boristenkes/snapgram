import ErrorMessage from '@/components/error-message'
import Tag from '@/components/tag'
import { fetchPopularHashtags } from '@/lib/actions/post.actions'

export default async function PopularTags() {
	const response = await fetchPopularHashtags()

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<ul className='flex justify-center gap-3 mt-8 text-sm sm:text-base'>
			{response.hashtags.map(hashtag => (
				<li key={hashtag}>
					<Tag
						tag={hashtag}
						className='py-3 px-4 rounded-full bg-neutral-700 border-2 border-neutral-600 font-semibold text-neutral-500 hover:brightness-125 transition-[filter] duration-200'
					/>
				</li>
			))}
		</ul>
	)
}

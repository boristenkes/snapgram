'use client'

import ErrorMessage from '@/components/error-message'
import {
	FetchPopularHashtags,
	fetchPopularHashtags
} from '@/lib/actions/post.actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PopularTags() {
	const [response, setResponse] = useState<
		FetchPopularHashtags & { pending?: boolean }
	>({
		success: true,
		hashtags: [],
		pending: true
	})

	useEffect(() => {
		;(async () => {
			const resp = await fetchPopularHashtags()
			setResponse(resp)
		})()
	}, [])

	if (!response.success) return <ErrorMessage message={response.message} />

	return response?.pending ? (
		<p className='text-center my-4'>Loading tags...</p>
	) : (
		<ul className='flex justify-center gap-3 mt-8 text-sm sm:text-base'>
			{response.hashtags.map(hashtag => (
				<li key={hashtag}>
					<Link
						href={{
							pathname: '/explore',
							query: { search: hashtag }
						}}
						className='py-3 px-4 rounded-full bg-neutral-700 border-2 border-neutral-600 font-semibold text-neutral-500'
					>
						#{hashtag}
					</Link>
				</li>
			))}
		</ul>
	)
}

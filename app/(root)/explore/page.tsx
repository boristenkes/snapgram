'use client'

import { searchPosts, type SearchPosts } from '@/lib/actions/post.actions'
import ExploreHeader from './explore-header'
import PostList from '@/components/post-list'
import ErrorMessage from '@/components/error-message'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ExplorePage() {
	const searchParams = useSearchParams()
	const searchTerm = searchParams.get('search') ?? ''
	const [searchResponse, setSearchResponse] = useState<
		SearchPosts & { pending?: boolean }
	>({
		success: true,
		posts: [],
		pending: true
	})

	useEffect(() => {
		;(async () => {
			const response = await searchPosts(searchTerm)
			setSearchResponse(response)
		})()
	}, [searchTerm])

	return (
		<div className='my-16'>
			<ExploreHeader searchTerm={searchTerm} />

			<main className='w-[min(62.5rem,100%-2rem)] mx-auto'>
				<h1 className='text-2xl font-bold mt-20 sm:text-3xl'>Popular Today</h1>

				{searchResponse?.pending && (
					<p className='text-center my-4'>Loading posts...</p>
				)}

				{!searchResponse?.pending && !searchResponse.success && (
					<ErrorMessage message={searchResponse.message} />
				)}

				{!searchResponse?.pending && searchResponse.success && (
					<PostList posts={searchResponse.posts} />
				)}
			</main>
		</div>
	)
}

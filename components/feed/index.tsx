import { fetchPosts } from '@/lib/actions/post.actions'
import auth from '@/lib/auth'
import ErrorMessage from '../error-message'
import Post from '@/components/post'
import SuggestedAccounts from '@/app/(root)/suggested-accounts'
import { Suspense } from 'react'
import UserCardListSkeleton from '../skeletons/user-card-list'

export default async function Feed() {
	const { user: currentUser } = await auth()
	const response = await fetchPosts(
		{
			$or: [
				{ author: { $in: currentUser.following } },
				{ author: currentUser._id }
			]
		},
		{
			populate: ['author', 'image name username'],
			sort: { createdAt: -1 }
		}
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	if (!response.posts.length)
		return (
			<div>
				<h1 className='text-center text-2xl font-semibold'>
					Follow someone to see their posts
				</h1>

				<div className='container lg:hidden'>
					<div className='py-8 space-y-4'>
						<h2 className='text-xl font-semibold'>Suggested Accounts</h2>

						<Suspense fallback={<UserCardListSkeleton />}>
							<SuggestedAccounts />
						</Suspense>
					</div>
				</div>
			</div>
		)

	return (
		<ul className='mx-auto mb-10 space-y-10 sm:w-[min(37.5rem,100%)]'>
			{response.posts?.map(post => (
				<li key={post._id}>
					<Post post={post} />
				</li>
			))}
		</ul>
	)
}

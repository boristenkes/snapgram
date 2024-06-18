import ErrorMessage from '@/components/error-message'
import PostList from '@/components/post-list'
import { Button } from '@/components/ui/button'
import { fetchPosts } from '@/lib/actions/post.actions'
import auth from '@/lib/auth'
import Link from 'next/link'

export default async function Posts({ userId }: { userId: string }) {
	const { user: currentUser } = await auth()
	const response = await fetchPosts({ author: userId })

	if (!response.success) return <ErrorMessage message={response.message} />

	if (!response.posts.length && currentUser._id === userId) {
		return (
			<div className='size-full min-h-96 grid place-content-center gap-4'>
				<p>You don't have any posts</p>
				<Button
					asChild
					className='w-fit mx-auto'
				>
					<Link href='/post/new'>Create post</Link>
				</Button>
			</div>
		)
	}

	return <PostList posts={response.posts} />
}

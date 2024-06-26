import PostCard from '@/components/post-card'
import { type Post as PostType } from '@/lib/types'

type PostListProps = {
	posts: PostType[]
}

export default function PostList({ posts }: PostListProps) {
	return (
		<div className='grid grid-cols-3 mt-8 sm:mt-14 gap-2 w-full'>
			{posts.length ? (
				posts.map((post, index) => (
					<PostCard
						key={post._id.toString()}
						post={post}
						priority={index < 2}
					/>
				))
			) : (
				<p className='text-neutral-500 italic'>No posts to display.</p>
			)}
		</div>
	)
}

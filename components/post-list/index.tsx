import { type Post as PostType } from '@/lib/types'
import Post from '../post'

type PostListProps = {
	posts: PostType[]
}

export default function PostList({ posts }: PostListProps) {
	return (
		<div className='grid grid-cols-3 mt-14 gap-2 w-full'>
			{posts.map(post => (
				<Post
					key={post._id.toString()}
					post={post}
				/>
			))}
		</div>
	)
}
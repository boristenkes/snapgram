import PostDetails from '@/components/post-details'
import { fetchPost } from '@/lib/actions/post.actions'
import auth from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'

type PostInfoProps = {
	postId: string
}

export default async function PostInfo({ postId }: PostInfoProps) {
	const { user: currentUser } = await auth()
	const response = await fetchPost(
		{ _id: postId },
		{ populate: ['author', 'image username name private'] }
	)

	if (!response.success) notFound()

	const isPrivateAuthor = response.post.author.private
	const isCurrentUserFollower = currentUser.following.includes(
		response.post.author._id
	)
	const isCurrentUserAuthor = currentUser._id === response.post.author._id

	if (isPrivateAuthor && !isCurrentUserFollower && !isCurrentUserAuthor)
		redirect('/')

	const { post } = response

	return <PostDetails post={post} />
}

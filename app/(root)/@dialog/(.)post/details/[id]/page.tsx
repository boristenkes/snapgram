import Modal from '@/components/modal'
import PostDetails from '@/components/post-details'
import { fetchPost } from '@/lib/actions/post.actions'
import { getCurrentUser } from '@/lib/session'
import { notFound, redirect } from 'next/navigation'

export default async function PostModal({
	params: { id }
}: {
	params: { id: string }
}) {
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchPost(
		{ _id: id },
		{ populate: ['author', 'image username name private'] }
	)

	if (!response.success) notFound()

	const isPrivateAuthor = response.post.author.private
	const isCurrentUserFollower = currentUser.following.includes(
		response.post.author._id
	)

	if (isPrivateAuthor && !isCurrentUserFollower) redirect('/')

	const { post } = response

	return (
		<Modal>
			<PostDetails post={post} />
		</Modal>
	)
}

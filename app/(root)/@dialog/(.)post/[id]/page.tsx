import Modal from '@/components/modal'
import PostDetails from '@/components/post-details'
import { DialogClose } from '@/components/ui/dialog'
import { fetchPost } from '@/lib/actions/post.actions'
import { notFound } from 'next/navigation'

export default async function PostModal({
	params: { id }
}: {
	params: { id: string }
}) {
	const response = await fetchPost(
		{ _id: id },
		{ populate: ['author', 'image username name'] }
	)

	if (!response.success) notFound()

	const { post } = response

	return (
		<Modal>
			<PostDetails post={post} />
		</Modal>
	)
}

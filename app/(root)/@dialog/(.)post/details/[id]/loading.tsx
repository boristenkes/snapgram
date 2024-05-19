import Modal from '@/components/modal'
import PostDetailsSkeleton from '@/components/skeletons/post-details'

export default function PostDetailsLoading() {
	return (
		<Modal>
			<PostDetailsSkeleton />
		</Modal>
	)
}

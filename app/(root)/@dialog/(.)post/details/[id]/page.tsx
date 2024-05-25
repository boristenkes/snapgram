import Modal from '@/components/modal'
import { Suspense } from 'react'
import PostInfo from './post-info'
import PostDetailsSkeleton from '@/components/skeletons/post-details'

export default async function PostModal({
	params: { id }
}: {
	params: { id: string }
}) {
	return (
		<Modal>
			<Suspense fallback={<PostDetailsSkeleton />}>
				<PostInfo postId={id} />
			</Suspense>
		</Modal>
	)
}

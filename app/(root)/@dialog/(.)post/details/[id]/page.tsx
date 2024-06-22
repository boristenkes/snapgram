import Modal from '@/components/modal'
import PostDetailsSkeleton from '@/components/skeletons/post-details'
import { Suspense } from 'react'
import PostInfo from './post-info'

export default async function PostModal({
	params: { id }
}: {
	params: { id: string }
}) {
	return (
		<Modal>
			<Suspense fallback={<PostDetailsSkeleton />}>
				<div className='max-h-[90vh] overflow-y-auto'>
					<PostInfo postId={id} />
				</div>
			</Suspense>
		</Modal>
	)
}

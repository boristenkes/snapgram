import ErrorMessage from '@/components/error-message'
import { fetchPost } from '@/lib/actions/post.actions'
import Image from 'next/image'
import EditPostForm from './edit-post-form'

export default async function EditPostPage({
	params: { id }
}: {
	params: { id: string }
}) {
	const response = await fetchPost(
		{ _id: id },
		{ populate: ['mentions', 'image username'] }
	)

	return (
		<main className='my-20 mx-auto flex-1 max-w-xl w-full px-8'>
			<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5'>
				<Image
					src='/assets/icons/edit-neutral.svg'
					alt=''
					width={36}
					height={36}
					className='w-6 h-6 lg:w-9 lg:h-9'
				/>
				Edit Post
			</h1>
			{response.success ? (
				<EditPostForm post={response.post} />
			) : (
				<ErrorMessage message={response.message} />
			)}
		</main>
	)
}

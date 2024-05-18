import Image from 'next/image'
import NewPostForm from './new-post-form'
import RightSidebar from './right-sidebar'

export default function NewPostPage() {
	return (
		<div className='flex'>
			<main className='my-10 lg:my-20 mx-auto flex-1 max-w-xl w-full px-8'>
				<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5 mb-8'>
					<Image
						src='/assets/icons/create-post-neutral.svg'
						alt=''
						width={36}
						height={36}
					/>
					Create a Post
				</h1>

				<NewPostForm />
			</main>

			<RightSidebar className='hidden lg:block' />
		</div>
	)
}

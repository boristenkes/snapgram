import Image from 'next/image'

export default async function ChatsPage() {
	return (
		<div className='w-[min(37.5rem,100%-2rem)] py-5 px-4 sm:py-9 sm:px-7 mx-auto rounded-2xl space-y-4 grid place-content-center h-full'>
			<Image
				src='/assets/icons/chats-neutral.svg'
				alt=''
				width={48}
				height={48}
				className='size-12 mx-auto'
			/>
			<h2 className='text-xl font-semibold text-center'>Your messages</h2>
			<p className='text-neutral-500 text-center'>
				Select a user to see your messages with them
			</p>
		</div>
	)
}

import ChatList from '@/components/chat-list'
import MobileChatList from '@/components/mobile-chat-list'
import auth from '@/lib/auth'
import Image from 'next/image'

export default async function ChatsLayout({
	children
}: {
	children: React.ReactNode
}) {
	const { user: currentUser } = await auth()

	return (
		<main className='container h-[min(70rem,100%-2rem)] flex flex-col lg:flex-row gap-8 pt-10 lg:pt-20 flex-1 px-8 pb-20'>
			<div className='w-full max-w-96 hidden lg:block'>
				<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5 mb-10 lg:mb-14'>
					<Image
						src='/assets/icons/chats-neutral.svg'
						alt=''
						width={36}
						height={36}
						className='w-7 lg:w-9'
					/>
					Chats
				</h1>

				<ChatList userId={currentUser._id} />
			</div>

			<div className='flex items-center gap-4 w-[min(37.5rem,100%-2rem)] mx-auto lg:hidden'>
				<MobileChatList currentUserId={currentUser._id} />
				<h1 className='text-2xl lg:text-4xl font-bold'>Chats</h1>
			</div>

			<div className='bg-[#09090A] w-[min(37.5rem,100%-2rem)] h-full py-5 px-4 sm:py-9 sm:px-7 mx-auto rounded-2xl border-2 border-neutral-700'>
				{children}
			</div>
		</main>
	)
}

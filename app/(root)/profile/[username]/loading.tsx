import ParagraphSkeleton from '@/components/skeletons/paragraph'
import { Skeleton } from '@/components/ui/skeleton'

export default function UserLoading() {
	return (
		<div className='w-[min(65.5rem,100%-2rem)] my-10 mx-auto px-4 | large:my-20 large:px-16'>
			<div className='flex gap-4 | large:gap-8'>
				<Skeleton className='size-20 rounded-full large:size-40' />

				<div className='flex-1'>
					<div className='hidden items-center gap-12 mb-2 | small:flex'>
						<Skeleton className='w-[222px] h-10 rounded-lg' />

						<div className='flex gap-3'>
							<Skeleton className='w-20 h-9 rounded-lg' />
							<Skeleton className='w-20 h-9 rounded-lg' />
						</div>
					</div>

					<Skeleton className='w-[85px] h-7 rounded-lg hidden | small:block' />

					<div className='flex items-center justify-around w-full font-medium mb-6 text-center | large:text-xl small:mt-6 small:justify-start small:gap-10'>
						<Skeleton className='w-20 h-7 rounded-lg' />
						<Skeleton className='w-20 h-7 rounded-lg' />
						<Skeleton className='w-20 h-7 rounded-lg' />
					</div>

					<ParagraphSkeleton />
				</div>
			</div>

			{/* Mobile */}
			{/* <div className='my-2 small:hidden'>
				<h1 className='font-semibold flex items-center gap-1 text-nowrap'>
					{user?.name}
					{user?.verified && (
						<Image
							src='/assets/icons/verified.svg'
							alt='Verified'
							width={20}
							height={21}
							className='w-3.5 h-3.5'
						/>
					)}
				</h1>

				<p className='text-neutral-500 text-sm'>@{user?.username}</p>

				{!!user?.bio.length && (
					<pre className='text-sm w-paragraph font-inherit mt-1'>
						{user?.bio}
					</pre>
				)}

				<div className='my-3'>
					{isCurrentUser ? (
						<Button
							size='xs'
							variant='dark'
							className='py-1.5'
							href='/profile/edit'
						>
							<Image
								src='/assets/icons/edit.svg'
								alt=''
								width={16}
								height={16}
							/>
							Edit Profile
						</Button>
					) : (
						<div className='flex gap-3'>
							<FollowButton
								currentUserStr={JSON.stringify(currentUser)}
								targetUserStr={JSON.stringify(user)}
								formProps={{ className: 'flex-1' }}
								stretch
							/>

							<Button
								size='xs'
								variant='light'
								// href={`/chat/${user?._id}`}
								className='flex-1'
							>
								Message
							</Button>
						</div>
					)}
				</div>
			</div> */}
		</div>
	)
}

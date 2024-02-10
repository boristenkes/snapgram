import { UserProfile } from '@/lib/types'
import Image from 'next/image'
import ProfilePicture from '../profile-picture'
import { Button } from '../elements'
import FollowButton from '../follow-button'

type ProfileProps = {
	user: UserProfile
	currentUser: UserProfile
}

export default async function Profile({ user, currentUser }: ProfileProps) {
	const isMyProfile = user?._id === currentUser?._id

	return (
		<main className='w-[min(65.5rem,100%-2rem)] my-10 mx-auto px-4 | large:my-20 large:px-16'>
			<div className='flex gap-4 | large:gap-8'>
				<ProfilePicture
					url={user?.image}
					alt={
						isMyProfile
							? 'Your profile picture'
							: `${user?.name}'s profile picture`
					}
					width={150}
					height={150}
					className='w-20 h-20 | large:w-40 large:h-40'
					priority
				/>
				<div className='flex-1'>
					<div className='hidden items-center gap-12 mb-2 | small:flex'>
						<h1 className='text-xl font-semibold flex items-center gap-2.5 text-nowrap | large:text-4xl'>
							{user?.name}
							{user?.verified && (
								<Image
									src='/assets/icons/verified.svg'
									alt='Verified'
									width={20}
									height={21}
								/>
							)}
						</h1>

						{isMyProfile ? (
							<Button
								size='xs'
								variant='dark'
								className='py-3'
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
								/>

								<Button
									size='xs'
									variant='light'
									href={`/chat/${user?._id}`}
								>
									Message
								</Button>
							</div>
						)}
					</div>

					<p className='text-neutral-500 text-lg hidden | small:block'>
						@{user?.username}
					</p>

					<div className='flex items-center justify-around w-full font-medium mb-6 text-center | large:text-xl small:mt-6 small:justify-start small:gap-10'>
						<UserStats
							label='Posts'
							count={user?.postsCount}
						/>
						<UserStats
							label='Followers'
							count={user?.followersCount}
						/>
						<UserStats
							label='Following'
							count={user?.followingCount}
						/>
					</div>

					<pre className='text-base w-paragraph font-inherit hidden | large:block'>
						{user?.bio || (
							<span className='text-neutral-500 italic'>No bio</span>
						)}
					</pre>
				</div>
			</div>

			{/* Mobile */}
			<div className='my-2 small:hidden'>
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

				<pre className='text-sm w-paragraph font-inherit mt-1'>
					{user?.bio || <span className='text-neutral-500 italic'>No bio</span>}
				</pre>

				<div className='my-3'>
					{isMyProfile ? (
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
								href={`/chat/${user?._id}`}
								className='flex-1'
							>
								Message
							</Button>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}

function UserStats({ label, count = 0 }: { label: string; count?: number }) {
	return (
		<div className='grid | small:flex small:items-center small:gap-1.5'>
			<span className='text-primary-500'>{count}</span>
			<span className='text-sm | small:text-base'>{label}</span>
		</div>
	)
}

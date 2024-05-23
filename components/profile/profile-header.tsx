import auth from '@/lib/auth'
import Avatar from '../avatar'
import { User } from '@/lib/types'
import Image from 'next/image'
import { Button } from '../elements'
import FollowButton from '../follow-button'
import FollowersList from '../followers-list'
import FollowingList from '../following-list'

type ProfileHeaderProps = {
	user: User
	isCurrentUser: boolean
}

export default async function ProfileHeader({
	user,
	isCurrentUser
}: ProfileHeaderProps) {
	const { user: currentUser } = await auth()

	return (
		<>
			<div className='flex gap-4 | large:gap-8'>
				<Avatar
					url={user?.image}
					alt={
						isCurrentUser
							? 'Your profile picture'
							: `${user?.name}'s profile picture`
					}
					width={150}
					height={150}
					className='size-20 | large:size-40'
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

						{isCurrentUser ? (
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
									// href={`/chat/${user?._id}`}
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

						<FollowersList
							userId={user._id}
							isUserPrivate={user.private}
						>
							<UserStats
								label='Followers'
								count={user?.followersCount}
							/>
						</FollowersList>

						<FollowingList
							userId={user._id}
							isUserPrivate={user.private}
						>
							<UserStats
								label='Following'
								count={user?.followingCount}
							/>
						</FollowingList>
					</div>

					{!!user?.bio.length && (
						<pre className='text-base w-paragraph font-inherit hidden | small:block'>
							{user?.bio}
						</pre>
					)}
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
			</div>
		</>
	)
}

function UserStats({ label, count = 0 }: { label: string; count?: number }) {
	const formatter = Intl.NumberFormat('en', {
		notation: 'compact'
	})
	const formattedCount = formatter.format(count)

	return (
		<div className='grid | small:flex small:items-center small:gap-1.5'>
			<span className='text-primary-500'>{formattedCount}</span>
			<span className='text-sm | small:text-base'>{label}</span>
		</div>
	)
}

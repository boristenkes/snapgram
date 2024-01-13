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
		<main className='my-20 mx-16'>
			<div className='flex gap-8'>
				<ProfilePicture
					url={user?.image}
					alt={
						isMyProfile
							? 'Your profile picture'
							: `${user?.name}'s profile picture`
					}
					width={150}
					height={150}
					className='w-40 h-40'
					priority
				/>
				<div>
					<div className='flex items-center gap-12 mb-2'>
						<h1 className='text-4xl font-semibold flex items-center gap-2.5'>
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
					<p className='text-neutral-500 text-lg'>@{user?.username}</p>
					<div className='flex items-center gap-10 text-xl font-medium my-6'>
						<div>
							<span className='text-primary-500'>{user?.postsCount} </span>
							Posts
						</div>
						<div>
							<span className='text-primary-500'>{user?.followersCount} </span>
							Followers
						</div>
						<div>
							<span className='text-primary-500'>{user?.followingCount} </span>
							Following
						</div>
					</div>
					<p className='text-base w-paragraph'>
						{user?.bio || (
							<span className='text-neutral-500 italic'>No bio</span>
						)}
					</p>
				</div>
			</div>
		</main>
	)
}

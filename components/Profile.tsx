import { UserProfile } from '@/lib/types'
import Image from 'next/image'
import ProfilePicture from './profile-picture'
import { Button } from './elements'

type ProfileProps = {
	user: UserProfile
	currentUser: UserProfile
}

export default async function Profile({ user, currentUser }: ProfileProps) {
	const isMyProfile = user?._id === currentUser?._id

	const isInFollowing =
		!isMyProfile &&
		currentUser?.following.some(user => user._id === currentUser?._id)

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
								{isInFollowing ? (
									<Button
										size='xs'
										className='bg-neutral-600 border-neutral-600'
									>
										Following
									</Button>
								) : (
									<Button size='xs'>Follow</Button>
								)}
								<Button
									size='xs'
									variant='light'
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
						{user?.bio ||
							'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat, quam provident, tempore impedit ipsam et accusantium, in consequatur maiores deleniti quo! Voluptate atque voluptates accusantium laudantium. Atque minus voluptas autem!'}
					</p>
				</div>
			</div>
		</main>
	)
}

import Avatar from '@/components/avatar'
import ErrorMessage from '@/components/error-message'
import FollowButton from '@/components/follow-button'
import { fetchUsers } from '@/lib/actions/user.actions'
import auth from '@/lib/auth'
import { User2Icon } from 'lucide-react'
import Link from 'next/link'

export default async function SuggestedAccountsPage() {
	const { user: currentUser } = await auth()
	const response = await fetchUsers(
		{
			onboarded: true,
			$and: [
				{ _id: { $ne: currentUser._id } },
				{ _id: { $nin: currentUser.following } }
			]
		},
		{
			select: 'image username name',
			sort: {
				followersCount: 'desc',
				postsCount: 'desc'
			}
		}
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	return (
		<main className='my-10 lg:my-20 flex-1 px-8'>
			<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5 mb-10 lg:mb-14'>
				<User2Icon
					width={36}
					height={36}
					className='w-7 lg:w-9'
				/>
				Suggested accounts
			</h1>

			<ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl'>
				{response.users.map(user => (
					<li key={user._id}>
						<div className='bg-[#0c0c0e] border-2 border-neutral-600 rounded-lg py-4 px-2 text-center hover:bg-[#101013] transition-colors'>
							<Link
								href={`/profile/${user.username}`}
								className='grid'
							>
								<Avatar
									url={user.image}
									alt={user.name}
									width={72}
									height={72}
									className='mx-auto mb-2'
								/>
								<strong>{user.name}</strong>
								<small className='text-neutral-500'>@{user.username}</small>
							</Link>

							<FollowButton
								currentUserStr={JSON.stringify(currentUser)}
								targetUserStr={JSON.stringify(user)}
								size='default'
								className='mt-2 px-6'
							/>
						</div>
					</li>
				))}
			</ul>
		</main>
	)
}

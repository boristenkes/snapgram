import ErrorMessage from '@/components/error-message'
import FollowButton from '@/components/follow-button'
import UserCard from '@/components/user-card'
import { fetchUsers } from '@/lib/actions/user.actions'
import auth from '@/lib/auth'

export default async function SuggestedAccounts() {
	const { user: currentUser } = await auth()
	const response = await fetchUsers(
		{
			onboarded: true,
			$and: [
				{ _id: { $ne: currentUser._id } },
				{ _id: { $nin: currentUser.following } }
			]
		},
		{ select: 'image username name', limit: 10 }
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	const suggestedAccounts = response.users

	return (
		<ul className='h-full overflow-y-auto custom-scrollbar pb-8'>
			{suggestedAccounts?.map(account => (
				<li
					key={account.username}
					className='flex items-center justify-between has-[:hover]:bg-neutral-700/50 rounded-md transition-colors duration-200'
				>
					<div className='flex items-center justify-between w-full has-[:hover]:bg-neutral-600/50 rounded-md transition-colors duration-200'>
						<UserCard user={account} />

						<FollowButton
							currentUserStr={JSON.stringify(currentUser)}
							targetUserStr={JSON.stringify(account)}
							className='py-2 px-4 bg-transparent text-primary-500 border-none transition-colors hover:bg-primary-500/20'
						/>
					</div>
				</li>
			))}
		</ul>
	)
}

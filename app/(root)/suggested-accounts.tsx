import FollowButton from '@/components/follow-button'
import { fetchUsers } from '@/lib/actions/user.actions'
import { getCurrentUser } from '@/lib/session'
import ErrorMessage from '@/components/error-message'
import UserCard from '@/components/user-card'

export default async function SuggestedAccounts() {
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchUsers(
		{ _id: { $ne: currentUser._id } },
		{ select: 'image username name' }
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	const suggestedAccounts = response.users

	return (
		<div className='py-8 space-y-4'>
			<h2 className='text-xl font-semibold'>Suggested Accounts</h2>
			<ul>
				{suggestedAccounts?.map(account => (
					<li
						key={account.username}
						className='flex items-center justify-between has-[:hover]:bg-neutral-700/50 rounded-md transition-colors duration-200'
					>
						<div className='flex items-center justify-between w-full has-[:hover]:bg-neutral-600/50 rounded-md transition-colors duration-200'>
							<UserCard
								user={account}
								withFollowButton
								followButtonProps={{
									className:
										'py-2 px-4 bg-transparent text-primary-500 border-none transition-colors hover:bg-primary-500/20'
								}}
							/>
							<FollowButton
								currentUserStr={JSON.stringify(currentUser)}
								targetUserStr={JSON.stringify(account)}
								className='py-2 px-4 bg-transparent text-primary-500 border-none transition-colors hover:bg-primary-500/20'
							/>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

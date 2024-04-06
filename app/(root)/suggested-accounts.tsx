import FollowButton from '@/components/follow-button'
import Avatar from '@/components/avatar'
import { fetchUsers } from '@/lib/actions/user.actions'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'
import ErrorMessage from '@/components/error-message'

export default async function SuggestedAccounts() {
	const { user: currentUser } = await getCurrentUser()
	const response = await fetchUsers(
		{ _id: { $ne: currentUser._id } },
		'image username name'
	)

	if (!response.success) return <ErrorMessage message={response.message} />

	const suggestedAccounts = response.users

	return (
		<div className='py-8 space-y-4'>
			<h2 className='text-xl font-semibold'>Suggested Accounts</h2>
			<ul className='space-y-4'>
				{suggestedAccounts?.map(account => (
					<li
						key={account.username}
						className='flex items-center justify-between'
					>
						<Link
							href={`/profile/${account.username}`}
							className='flex items-center gap-2'
						>
							<Avatar
								url={account.image}
								width={40}
							/>
							<div className='flex-1 grid'>
								<strong>{account.name}</strong>
								<small className='text-neutral-500'>{account.username}</small>
							</div>
						</Link>
						<FollowButton
							currentUserStr={JSON.stringify(currentUser)}
							targetUserStr={JSON.stringify(account)}
							className='py-2 px-4 bg-transparent text-primary-500 border-none transition-colors hover:bg-primary-500/20'
						/>
					</li>
				))}
			</ul>
		</div>
	)
}

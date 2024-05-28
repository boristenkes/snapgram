import DeleteAccountButton from './delete-account-button'
import auth from '@/lib/auth'
import PrivateAccountSwitch from './private-account-switch'

export async function generateMetadata() {
	const { user: currentUser } = await auth()

	return {
		title: 'Settings • Snapgram',
		description: `Manage your account: ${currentUser.name} (@${currentUser.username})`
	}
}

export default async function SettingsPage() {
	const { user: currentUser } = await auth()

	return (
		<main className='mx-4 lg:mx-16 my-10 lg:my-20'>
			<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5 mb-12'>
				Manage Your Account
			</h1>

			<div className='space-y-16 w-paragraph'>
				<div className='space-y-2'>
					<h2 className='text-lg lg:text-2xl'>Account privacy</h2>

					<div className='w-full h-px bg-neutral-500 rounded-full' />

					<PrivateAccountSwitch
						userId={currentUser._id}
						defaultIsPrivate={currentUser.private}
					/>

					<p className='text-sm text-neutral-200 w-paragraph'>
						When your account is public, your profile and posts can be seen by
						anyone
					</p>
					<p className='text-sm text-neutral-200 w-paragraph'>
						When your account is private, only your followers can see what you
						share, including your photos, videos, stories and your followers and
						following lists.
					</p>
				</div>

				<div className='space-y-2'>
					<h2 className='text-lg lg:text-2xl'>Delete your account</h2>

					<div className='w-full h-px bg-neutral-500 rounded-full' />

					<p className='text-sm text-neutral-200 w-paragraph'>
						By deleting your account, you are permanently deleting all your data
						and data related to you from our servers. This will delete all your
						posts, stories and remove you from other user's following lists
					</p>

					<div className='py-2'>
						<DeleteAccountButton
							currentUserId={currentUser._id}
							currentUserUsername={currentUser.username}
						/>
					</div>
				</div>
			</div>
		</main>
	)
}

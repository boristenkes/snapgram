import auth from '@/lib/auth'
import { Metadata } from 'next'
import Image from 'next/image'
import EditProfileForm from './edit-profile-form'

export const metadata: Metadata = {
	title: 'Edit profile • Snapgram',
	description:
		'Customize your Snapgram profile. Update your profile picture, change your username, name, email, or bio.'
}

export default async function EditProfilePage() {
	const { user: currentUser } = await auth()

	return (
		<main className='mx-4 lg:mx-16 my-10 lg:my-20'>
			<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5'>
				<Image
					src='/assets/icons/edit-neutral.svg'
					alt=''
					width={36}
					height={36}
					className='w-6 h-6 lg:w-9 lg:h-9'
				/>
				Edit Profile
			</h1>
			<EditProfileForm profile={currentUser} />
		</main>
	)
}

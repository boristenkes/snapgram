import EditProfileForm from './edit-profile-form'
import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'

export default async function EditProfilePage() {
	const { user: currentUser } = await getCurrentUser()

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
			<EditProfileForm profile={JSON.stringify(currentUser)} />
		</main>
	)
}
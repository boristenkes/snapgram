import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getCurrentUser()

	if (session) redirect('/')

	return (
		<div className='flex h-screen overflow-hidden'>
			<div className='flex-1 flex flex-col justify-center items-center'>
				{children}
			</div>
			<div className='flex-1 w-full h-full hidden lg:block'>
				<Image
					src='/assets/login-banner.png'
					alt=''
					width={720}
					height={1024}
					priority
					className='object-cover w-full h-full'
				/>
			</div>
		</div>
	)
}

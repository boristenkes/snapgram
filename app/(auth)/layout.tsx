import Image from 'next/image'

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex h-screen overflow-hidden'>
			<main className='flex-1 flex flex-col justify-center items-center'>
				{children}
			</main>
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

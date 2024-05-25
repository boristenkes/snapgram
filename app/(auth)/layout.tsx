import Image from 'next/image'

export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex h-screen overflow-hidden'>
			<div className='flex-1 flex flex-col justify-center items-center'>
				{children}
			</div>
			<div className='flex-1 relative hidden lg:block'>
				<Image
					src='/assets/login-banner.png'
					alt=''
					fill
					priority
					className='absolute inset-0 object-cover'
					sizes='(min-width: 1024px) 50vw'
				/>
			</div>
		</div>
	)
}

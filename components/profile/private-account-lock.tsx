import Image from 'next/image'

export default function PrivateAccountLock({ userName }: { userName: string }) {
	return (
		<div className='mt-12 pt-12 border-t border-t-neutral-600'>
			<div className='w-fit p-8 pt-7 rounded-full aspect-square border mx-auto mb-4'>
				<Image
					src='/assets/icons/lock.svg'
					alt='Lock'
					width={130}
					height={130}
				/>
			</div>
			<h2 className='text-3xl font-semibold text-center'>
				This account is private
			</h2>
			<p className='text-neutral-200 text-center'>
				Follow {userName.split(' ')[0]} to see their content
			</p>
		</div>
	)
}

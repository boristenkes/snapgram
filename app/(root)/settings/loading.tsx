import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
	return (
		<div
			className='mx-4 lg:mx-16 my-10 lg:my-20'
			aria-label='Settings loading...'
		>
			<Skeleton className='w-[388px] h-10 rounded-lg mb-12' />

			<div className='space-y-16 w-paragraph'>
				<div className='space-y-2'>
					<Skeleton className='max-w-[183px] w-full h-8 rounded-lg mb-12' />
					<Skeleton className='max-w-[148px] w-full h-9 rounded-lg my-2' />
					<Skeleton className='max-w-[612px] w-full h-5 rounded-lg ' />
					<Skeleton className='max-w-[612px] h-10 rounded-lg' />
				</div>

				<div className='space-y-2'>
					<Skeleton className='max-w-48 w-full h-8 rounded-lg mb-12' />
					<Skeleton className='max-w-[612px] w-full h-[60px] rounded-lg' />
					<Skeleton className='w-[166px] h-9 rounded-lg my-2' />
				</div>
			</div>
		</div>
	)
}

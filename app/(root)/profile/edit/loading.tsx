import { Skeleton } from '@/components/ui/skeleton'

export default function EditProfileLoading() {
	return (
		<main className='mx-4 lg:mx-16 my-10 lg:my-20'>
			<Skeleton className='w-40 h-8 rounded-lg lg:w-[237px] lg:h-10' />

			<div className='max-w-2xl mt-14 rounded-lg'>
				<Skeleton className='w-full min-h-40 rounded-lg' />

				<div className='grid gap-3 mt-6'>
					<Skeleton className='w-[77px] h-6 rounded-lg' />
					<Skeleton className='w-full h-12 rounded-lg' />
				</div>

				<div className='grid gap-3 mt-6'>
					<Skeleton className='w-11 h-6 rounded-lg' />
					<Skeleton className='w-full h-12 rounded-lg' />
				</div>

				<div className='grid gap-3 mt-6'>
					<Skeleton className='w-10 h-6 rounded-lg' />
					<Skeleton className='w-full h-12 rounded-lg' />
				</div>

				<div className='grid gap-3 mt-6'>
					<Skeleton className='w-[103px] h-6 rounded-lg' />
					<Skeleton className='w-full h-[168px] rounded-lg' />
				</div>

				<Skeleton className='w-36 h-11 mt-10 ml-auto rounded-lg' />
			</div>
		</main>
	)
}

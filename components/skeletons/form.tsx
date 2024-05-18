import { Skeleton } from '../ui/skeleton'

export default function FormSkeleton() {
	return (
		<div className='w-full space-y-8'>
			<div className='space-y-3'>
				<Skeleton className='w-36 h-6 rounded-lg' />
				<Skeleton className='w-full h-40 rounded-lg' />
			</div>
			<div className='space-y-3'>
				<Skeleton className='w-36 h-6 rounded-lg' />
				<Skeleton className='w-full h-12 rounded-lg' />
			</div>
			<div className='space-y-3'>
				<Skeleton className='w-36 h-6 rounded-lg' />
				<Skeleton className='w-full h-12 rounded-lg' />
			</div>
			<div className='space-y-3'>
				<Skeleton className='w-36 h-6 rounded-lg' />
				<Skeleton className='w-full h-12 rounded-lg' />
			</div>
			<div className='space-y-3'>
				<Skeleton className='w-36 h-6 rounded-lg' />
				<Skeleton className='w-full h-12 rounded-lg' />
			</div>
			<Skeleton className='w-32 h-12 rounded-md ml-auto' />
		</div>
	)
}

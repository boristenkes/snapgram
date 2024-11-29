import { Skeleton } from '@/components/ui/skeleton'
import { User2Icon } from 'lucide-react'

export default function SuggestedAccountsPageLoading() {
	return (
		<main className='my-10 lg:my-20 flex-1 px-8'>
			<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5 mb-10 lg:mb-14'>
				<User2Icon
					width={36}
					height={36}
					className='w-7 lg:w-9'
				/>
				Suggested accounts
			</h1>

			<ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl'>
				{Array.from({ length: 12 }, (_, index) => index).map((_, idx) => (
					<li key={idx}>
						<div className='bg-[#0c0c0e] border-2 border-neutral-600 rounded-lg py-4 px-2 text-center hover:bg-[#101013] transition-colors'>
							<div className='grid gap-1'>
								<Skeleton className='size-16 rounded-full flex-none mx-auto' />
								<Skeleton className='w-full max-w-40 h-7 mx-auto' />
								<Skeleton className='w-20 h-4 mx-auto' />
							</div>

							<Skeleton className='h-10 w-28 rounded-lg mx-auto mt-2' />
						</div>
					</li>
				))}
			</ul>
		</main>
	)
}

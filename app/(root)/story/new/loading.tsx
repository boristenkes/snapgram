import { Skeleton } from '@/components/ui/skeleton'

export default function NewStoryLoading() {
	return (
		<main className='mx-4 lg:mx-16 my-10 lg:my-20'>
			<Skeleton className='w-52 h-8 rounded-lg mb-8' />

			<div className='max-w-2xl'>
				<Skeleton className='w-full h-40 rounded-lg mb-8 px-4' />

				<div className='space-y-2 mb-8'>
					<div className='space-y-2'>
						<Skeleton className='w-[9.5rem] h-5 rounded-lg' />
						<Skeleton className='w-[8.25rem] h-5 rounded-lg' />
						<Skeleton className='w-full h-12 rounded-lg' />
					</div>
					<Skeleton className='w-9 h-5 rounded-md ml-auto' />
				</div>

				<div className='space-y-2 mb-8'>
					<Skeleton className='w-9 h-5 rounded-lg' />
					<Skeleton className='w-[8.25rem] h-5 rounded-lg' />
					<Skeleton className='w-full h-12 rounded-lg' />
				</div>

				<div className='space-y-2 mb-8'>
					<Skeleton className='w-14 h-6 rounded-lg' />
					<Skeleton className='w-[8.25rem] h-5 rounded-lg' />
					<Skeleton className='w-full h-12 rounded-lg' />
				</div>

				<Skeleton className='w-[6.25rem] h-11 rounded-lg ml-auto' />
			</div>

			{/* <div className='max-w-2xl'>

				<MentionInput
					mentions={mentions}
					setMentions={setMentions}
				/>

				<TagInput
					tags={tags}
					setTags={setTags}
				/>

				<TextInput
					name='alt'
					label='Alt text'
					className='mt-6 mb-8 gap-1'
					description='Alt text describes your photos for people with visual impairments.'
				/>

				<SubmitButton
					pendingContent={<Loader text='Uploading...' />}
					size='sm'
					className='ml-auto mt-8 transition-all'
				>
					Upload
				</SubmitButton>
			</div> */}
		</main>
	)
}

import NewStoryForm from './new-story-form'

export default function NewStoryPage() {
	return (
		<main className='mx-4 lg:mx-16 my-10 lg:my-20'>
			<h1 className='text-2xl lg:text-4xl font-bold flex items-center gap-2.5 mb-8'>
				Create new story
			</h1>
			<NewStoryForm />
		</main>
	)
}

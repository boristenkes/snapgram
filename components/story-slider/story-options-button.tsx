import { Button } from '@/components/ui/button'
import auth from '@/lib/auth'
import { Ellipsis } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'
import DeleteStoryButton from './delete-story-button'

type Props = {
	storyId: string
	authorId: string
}

export default async function StoryOptionsButton({ storyId, authorId }: Props) {
	const { user: currentUser } = await auth()
	const isCurrentUserAuthor = currentUser._id === authorId

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
				>
					<Ellipsis size={18} />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='p-1'>
				{isCurrentUserAuthor && <DeleteStoryButton storyId={storyId} />}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

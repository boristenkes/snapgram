import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'
import DeleteStoryButton from './delete-story-button'

type Props = {
	storyId: string
}

export default async function StoryOptionsButton({ storyId }: Props) {
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
				<DeleteStoryButton storyId={storyId} />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

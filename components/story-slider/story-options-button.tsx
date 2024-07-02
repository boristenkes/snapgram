import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type Props = {
	storyId: string
}

export default function StoryOptionsButton({ storyId }: Props) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
				>
					<Ellipsis size={18} />
				</Button>
			</PopoverTrigger>

			<PopoverContent></PopoverContent>
		</Popover>
	)
}

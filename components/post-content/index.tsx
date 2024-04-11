import { cn } from '@/lib/utils'
import ContentViewer from '../content-viewer'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '../ui/carousel'

type PostContentProps = {
	content: string[]
	alt?: string
	className?: string
}

export default function PostContent({
	content,
	alt,
	className
}: PostContentProps) {
	return content.length === 1 ? (
		<ContentViewer
			src={content[0]}
			alt={alt}
			width={542}
			height={520}
			className={cn('aspect-square object-cover', className)}
		/>
	) : (
		<Carousel className={cn('max-h-[32.5rem]', className)}>
			<CarouselContent>
				{content.map(contentUrl => (
					<CarouselItem
						key={contentUrl}
						className='p-0'
					>
						<ContentViewer
							src={contentUrl}
							alt={alt}
							width={542}
							height={520}
							className='aspect-square object-cover w-full'
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className='left-4 bg-neutral-700 border-neutral-700' />
			<CarouselNext className='right-4 bg-neutral-700 border-neutral-700' />
		</Carousel>
	)
}

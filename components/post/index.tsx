import { Post as PostType } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

export default function Post({ post }: { post: PostType }) {
	return (
		<Link href={`/post/${post._id}`}>
			<article className='relative rounded-lg overflow-hidden aspect-square'>
				<Image
					src={post.content[0]}
					alt={post.altText}
					width={330}
					height={315}
					className='w-full h-full object-cover'
				/>
				{post.content.length > 1 && (
					<Image
						src='/assets/icons/gallery.svg'
						alt='Gallery'
						width={24}
						height={24}
						className='absolute top-4 right-3 w-4 h-4 | lg:w-5 lg:h-5 lg:top-5 lg:right-4'
					/>
				)}
			</article>
		</Link>
	)
}

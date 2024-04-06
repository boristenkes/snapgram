import { Post as PostType } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { imageTypes } from '@/constants'

export default function PostCard({ post }: { post: PostType }) {
	return (
		<Link href={`/post/${post._id}`}>
			<article className='relative rounded-lg overflow-hidden aspect-square transition-[filter] hover:brightness-110'>
				{imageTypes.some(type => post.content[0].endsWith(type)) ? (
					<Image
						src={post.content[0]}
						alt={post.altText}
						width={330}
						height={315}
						className='w-full h-full object-cover'
					/>
				) : (
					<video
						src={post.content[0]}
						width={330}
						height={315}
						className='w-full h-full object-cover'
					/>
				)}
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

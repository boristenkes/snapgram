import { Post as PostType } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

export default function Post({ post }: { post: PostType }) {
	return (
		<Link href={`/post/${post._id}`}>
			<article className='relative rounded-2xl overflow-hidden w-fit'>
				<Image
					src={post.content[0]}
					alt={post.altText}
					width={330}
					height={315}
				/>
				{post.content.length > 1 && (
					<Image
						src='/assets/icons/gallery.svg'
						alt='Gallery'
						width={24}
						height={24}
						className='absolute top-6 right-4'
					/>
				)}
			</article>
		</Link>
	)
}

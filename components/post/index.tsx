import DeletePostButton from '@/app/(root)/post/details/[id]/delete-post-button'
import Avatar from '@/components/avatar'
import PostActionButtons from '@/components/post-action-buttons'
import auth from '@/lib/auth'
import { Post as PostType } from '@/lib/types'
import { format } from 'date-fns'
import Link from 'next/link'
import MentionsViewer from '../mentions-viewer'
import Caption from '../post-caption'
import PostContent from '../post-content'
import CommentInput from './comment-input'

export default async function Post({ post }: { post: PostType }) {
	const { user: currentUser } = await auth()
	const isCurrentUserAuthor =
		post.author._id.toString() === currentUser._id.toString()
	const formattedDate = format(post.createdAt, "d MMMM 'at' hh:mm a")

	return (
		<article className='bg-[#09090A] w-[min(37.5rem,100%-2rem)] py-5 px-4 sm:py-9 sm:px-7 mx-auto rounded-2xl border-2 border-neutral-700'>
			<div className='flex justify-between items-start mb-5'>
				<Link
					href={`/profile/${post.author.username}`}
					className='flex gap-3'
				>
					<Avatar
						url={post.author.image}
						alt={post.author.name}
						width={50}
						height={50}
					/>

					<div>
						<strong>{post.author.name}</strong>
						<time
							className='text-neutral-500 block'
							dateTime={post.createdAt.toString()}
						>
							{formattedDate}
						</time>
					</div>
				</Link>

				{isCurrentUserAuthor && (
					<div className='flex flex-none items-center gap-3'>
						<Link
							href={`/post/edit/${post._id}`}
							aria-label='Edit post'
						>
							<svg
								width={18}
								height={18}
								viewBox='0 0 18 18'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M8.95202 0.0416262L10.2498 0.0416264C10.595 0.0416264 10.8748 0.321448 10.8748 0.666626C10.8748 1.0118 10.595 1.29163 10.2498 1.29163H8.99984C7.01798 1.29163 5.59447 1.29295 4.51115 1.4386C3.44582 1.58183 2.80355 1.85424 2.32883 2.32896C1.85412 2.80367 1.58171 3.44594 1.43848 4.51127C1.29283 5.59459 1.2915 7.0181 1.2915 8.99996C1.2915 10.9818 1.29283 12.4053 1.43848 13.4886C1.58171 14.554 1.85412 15.1962 2.32883 15.671C2.80355 16.1457 3.44582 16.4181 4.51115 16.5613C5.59447 16.707 7.01798 16.7083 8.99984 16.7083C10.9817 16.7083 12.4052 16.707 13.4885 16.5613C14.5539 16.4181 15.1961 16.1457 15.6708 15.671C16.1456 15.1962 16.418 14.554 16.5612 13.4886C16.7068 12.4053 16.7082 10.9818 16.7082 8.99996V7.74996C16.7082 7.40478 16.988 7.12496 17.3332 7.12496C17.6783 7.12496 17.9582 7.40478 17.9582 7.74996V9.04777C17.9582 10.9714 17.9582 12.479 17.8 13.6552C17.6382 14.8591 17.3004 15.8092 16.5547 16.5548C15.809 17.3005 14.859 17.6383 13.6551 17.8002C12.4788 17.9583 10.9713 17.9583 9.04765 17.9583H8.95203C7.02836 17.9583 5.52083 17.9583 4.34459 17.8002C3.14065 17.6383 2.19063 17.3005 1.44495 16.5548C0.699276 15.8092 0.361492 14.8591 0.199626 13.6552C0.0414849 12.479 0.0414934 10.9714 0.0415041 9.04777V8.95214C0.0414934 7.02848 0.0414849 5.52095 0.199626 4.34471C0.361492 3.14077 0.699276 2.19075 1.44495 1.44507C2.19063 0.699398 3.14065 0.361615 4.34459 0.199748C5.52083 0.0416069 7.02836 0.0416154 8.95202 0.0416262ZM12.9753 0.896555C14.1152 -0.24335 15.9633 -0.24335 17.1032 0.896555C18.2431 2.03646 18.2431 3.88461 17.1032 5.02452L11.5632 10.5646C11.2538 10.874 11.0599 11.0679 10.8437 11.2366C10.5889 11.4353 10.3133 11.6056 10.0216 11.7446C9.77401 11.8626 9.51396 11.9493 9.09883 12.0876L6.67839 12.8945C6.23152 13.0434 5.73884 12.9271 5.40576 12.594C5.07269 12.261 4.95638 11.7683 5.10534 11.3214L5.91214 8.90098C6.05049 8.48584 6.13716 8.22579 6.25517 7.97817C6.39416 7.68652 6.56451 7.41089 6.76321 7.15614C6.93191 6.93985 7.12575 6.74603 7.43521 6.43662L12.9753 0.896555ZM16.2194 1.78044C15.5676 1.12869 14.5109 1.12869 13.8592 1.78044L13.5453 2.09429C13.5642 2.17417 13.5907 2.26935 13.6275 2.37551C13.747 2.71973 13.9729 3.17305 14.3998 3.59995C14.8267 4.02685 15.2801 4.25285 15.6243 4.37227C15.7304 4.4091 15.8256 4.43556 15.9055 4.45448L16.2194 4.14063C16.8711 3.48888 16.8711 2.43219 16.2194 1.78044ZM14.9208 5.4392C14.4908 5.25429 13.99 4.95784 13.516 4.48384C13.042 4.00983 12.7455 3.50898 12.5606 3.07901L8.34776 7.29184C8.00066 7.63893 7.86454 7.77659 7.74885 7.92492C7.60599 8.10808 7.48351 8.30625 7.38357 8.51594C7.30264 8.68576 7.2404 8.86907 7.08517 9.33475L6.72526 10.4145L7.58531 11.2745L8.66505 10.9146C9.13073 10.7594 9.31404 10.6972 9.48385 10.6162C9.69354 10.5163 9.89172 10.3938 10.0749 10.2509C10.2232 10.1353 10.3609 9.99913 10.708 9.65203L14.9208 5.4392Z'
									fill='#877EFF'
								/>
							</svg>
						</Link>
						<DeletePostButton
							currentUserId={currentUser._id}
							targetPostId={post._id}
						/>
					</div>
				)}
			</div>

			<Caption
				caption={post.caption}
				tags={post.tags}
			/>

			<div className='relative'>
				<PostContent
					content={post.content}
					alt={post.altText}
					className='rounded-2xl overflow-hidden'
				/>
				{!!post.mentions.length && (
					<MentionsViewer mentions={post.mentions as string[]} />
				)}
			</div>

			<PostActionButtons
				currentUser={currentUser}
				post={post}
			/>

			<CommentInput postId={post._id} />
		</article>
	)
}

import Avatar from '@/components/avatar'
import { cn } from '@/lib/utils'

type AvatarUploaderProps = {
	imageErrors: string[]
	imageHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
	imageBlob: string
	defaultImage?: string
}

export default function AvatarUploader({
	imageErrors,
	imageHandler,
	imageBlob,
	defaultImage
}: AvatarUploaderProps) {
	return (
		<>
			<div
				className={cn(
					'relative h-52 bg-neutral-600 rounded-lg border-2 border-neutral-600',
					{
						'border-semantic-danger': imageErrors?.length
					}
				)}
			>
				<label
					htmlFor='profile-picture'
					className='w-full h-full flex flex-col justify-center items-center cursor-pointer'
				>
					<input
						type='file'
						id='profile-picture'
						name='image'
						accept='image/*'
						onChange={imageHandler}
						className='sr-only'
					/>
					<Avatar
						url={imageBlob || defaultImage}
						width={100}
						height={100}
						className='mb-4'
					/>
					Change profile photo
				</label>
			</div>
			{!!imageErrors?.length && (
				<ul className='text-semantic-danger'>
					{imageErrors?.map((error, i) => (
						<li key={i}>{error}</li>
					))}
				</ul>
			)}
		</>
	)
}

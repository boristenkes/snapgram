import CopyButton from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

type ShareButtonProps = {
	postId: string
}

export default function ShareButton({ postId }: ShareButtonProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type='submit'
					className='flex items-center gap-2'
					aria-label='Share post'
				>
					<Image
						src='/assets/icons/share.svg'
						alt=''
						width={20}
						height={20}
					/>
				</button>
			</DialogTrigger>
			<DialogContent className='bg-[#09090A] w-[min(37.5rem,100%-2rem)] py-5 px-4 sm:py-9 sm:px-7 sm:max-w-md rounded-2xl border-2 border-neutral-700'>
				<DialogHeader>
					<DialogTitle>Share post</DialogTitle>
					<DialogDescription>
						Copy post link and share it with others
					</DialogDescription>
				</DialogHeader>

				<div className='flex items-center space-x-2'>
					<div className='grid flex-1 gap-2'>
						<Label
							htmlFor={`link:${postId}`}
							className='sr-only'
						>
							Link
						</Label>
						<Input
							id={`link:${postId}`}
							defaultValue={`https://bt-snapgram.vercel.app/post/details/${postId}`}
							readOnly
						/>
					</div>
					<CopyButton
						text={`https://bt-snapgram.vercel.app/post/details/${postId}`}
					/>
				</div>

				<DialogFooter className='sm:justify-start'>
					<DialogClose asChild>
						<Button
							type='button'
							variant='secondary'
						>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

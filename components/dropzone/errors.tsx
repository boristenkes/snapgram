import { FileRejection } from 'react-dropzone'

type ErrorsProps = {
	fileRejections: FileRejection[]
}

export default function Errors({ fileRejections }: ErrorsProps) {
	return (
		!!fileRejections.length && (
			<ul className='text-semantic-danger'>
				{fileRejections.some(({ errors }) =>
					errors.some(err => err.code === 'too-many-files')
				) ? (
					<li className='text-semantic-danger'>
						You may upload only 1 file at a time
					</li>
				) : (
					fileRejections.map(({ file, errors }) => (
						<li
							key={file.name}
							className='flex items-center'
						>
							&ldquo;
							<span className='text-semantic-danger inline-block max-w-[20ch] overflow-x-hidden text-ellipsis whitespace-nowrap'>
								{file.name}
							</span>
							&rdquo;:&nbsp;
							<span className='inline-block text-semantic-danger/80'>
								{errors.map(error => error.message)}
							</span>
						</li>
					))
				)}
			</ul>
		)
	)
}

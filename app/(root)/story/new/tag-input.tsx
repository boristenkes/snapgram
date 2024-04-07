'use client'

import { removeDuplicates } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

type TagInputProps = {
	tags: string[]
	setTags: React.Dispatch<React.SetStateAction<string[]>>
}

export default function TagInput({ tags, setTags }: TagInputProps) {
	const [value, setValue] = useState('')

	const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value

		if (!val.trim().length) {
			setValue('')
			return
		}

		if (!val.endsWith(' ')) {
			setValue(val)
			return
		}

		setTags(prev => removeDuplicates([...prev, val.trim()]))
		setValue('')
	}

	const removeTag = (targetTag: string) => {
		setTags(prev => prev.filter(tag => tag !== targetTag))
	}

	return (
		<div className='space-y-2'>
			<label
				htmlFor='tags'
				className='cursor-text'
			>
				Tags
				<p className='text-neutral-500 text-sm mb-2'>Separated by space</p>
				<div className='flex flex-wrap relative space-x-2 bg-neutral-600 p-3 mt-2 rounded-lg w-full disabled:brightness-75'>
					{tags.map(tag => (
						<button
							onClick={() => removeTag(tag)}
							key={tag}
							type='button'
							className='bg-neutral-800 p-1 pr-3 my-1 rounded-md flex items-center text-sm gap-1'
							aria-label={`tag: ${tag}. click to remove`}
						>
							<Image
								src='/assets/icons/close.svg'
								alt='X'
								width={22}
								height={22}
								aria-hidden
							/>
							#{tag}
						</button>
					))}

					<input
						id='tags'
						name='tags'
						value={value}
						onChange={handleTagInput}
						autoComplete='off'
						className='bg-transparent w-fit outline-none'
					/>
				</div>
			</label>
		</div>
	)
}

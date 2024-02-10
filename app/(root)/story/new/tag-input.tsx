'use client'

import { useState } from 'react'

export default function TagInput() {
	const [tags, setTags] = useState<string[]>([])
	const [value, setValue] = useState('')

	const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	return (
		<div className='space-y-2'>
			<label htmlFor='tags'>Tag your friends</label>
			<div className='bg-neutral-600 p-3 rounded-lg w-full disabled:brightness-75'>
				<input
					id='tags'
					name='tags'
					onChange={handleTagInput}
					value={value}
					className='bg-transparent w-full'
				/>
			</div>
		</div>
	)
}

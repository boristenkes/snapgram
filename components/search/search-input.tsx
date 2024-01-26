'use client'

import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/use-debounce'
import { type SearchProps } from '.'
import Link from 'next/link'
import ProfilePicture from '../profile-picture'
import Loader from '../loader'

type SearchInputProps = SearchProps & {
	handleSearch: (...props: any) => any
}

export default function SearchInput({
	handleSearch,
	...rest
}: SearchInputProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const [searchResults, setSearchResults] = useState<any[]>([])

	const { debouncedValue, isPending } = useDebounce<string>(searchTerm)

	useEffect(() => {
		;(async () => {
			if (!searchTerm.length) {
				setSearchResults([])
				return
			}

			const results = await handleSearch(searchTerm)

			setSearchResults(JSON.parse(results))
		})()
	}, [debouncedValue])

	return (
		<div className=''>
			<input
				type='search'
				name='search'
				className='bg-transparent w-full rounded-lg outline-none placeholder:text-neutral-300 search-autofill'
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				autoComplete='off'
				{...rest}
			/>
			{!!searchResults?.length && (
				<ul className='absolute top-full left-0 w-full bg-neutral-700 mt-3 p-4 space-y-4 rounded-lg'>
					{searchResults.map(item => (
						<li key={item.username}>
							<Link
								href={`/profile/${item.username}`}
								className='flex items-center gap-2'
							>
								<ProfilePicture
									url={item.image}
									width={40}
								/>
								<div className='flex-1 grid'>
									<strong>{item.name}</strong>
									<small>{item.username}</small>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
			{isPending && <Loader className='mx-auto my-2 absolute top-2 right-10' />}
		</div>
	)
}

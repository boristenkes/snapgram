'use client'

import useDebounce from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'
import type { SearchProps, SearchResult } from '.'
import Loader from '../loader'

type SearchInputProps = SearchProps & {
	handleSearch: (...args: any[]) => any
	setSearchResults: React.Dispatch<React.SetStateAction<SearchResult[] | null>>
}

export default function SearchInput({
	handleSearch,
	setSearchResults,
	...rest
}: SearchInputProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const { debouncedValue, isPending } = useDebounce<string>(searchTerm)

	useEffect(() => {
		;(async () => {
			if (!searchTerm.length) {
				setSearchResults(null)
				return
			}

			const results = await handleSearch(searchTerm)

			setSearchResults(JSON.parse(results))
		})()
	}, [debouncedValue])

	return (
		<div>
			<label
				htmlFor='search-users'
				className='sr-only'
			>
				Search users
			</label>
			<input
				type='search'
				name='search'
				className='bg-transparent w-full rounded-lg outline-none placeholder:text-neutral-300 search-autofill'
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				autoComplete='off'
				id='search-users'
				{...rest}
			/>

			{isPending && <Loader className='mx-auto my-2 absolute top-2 right-10' />}
		</div>
	)
}

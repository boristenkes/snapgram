'use client'

import { TextInput } from '@/components/elements'
import Loader from '@/components/loader'
import { useDebounce } from '@/hooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PopularTags from './popular-tags'

type ExploreHeaderProps = {
	searchTerm: string
}

export default function ExploreHeader({ searchTerm }: ExploreHeaderProps) {
	const router = useRouter()
	const [search, setSearch] = useState(searchTerm ?? '')
	const { debouncedValue, isPending } = useDebounce(search)

	useEffect(() => {
		router.replace(`/explore?search=${search}`)
	}, [debouncedValue])

	useEffect(() => setSearch(searchTerm), [searchTerm])

	return (
		<header>
			<h2 className='font-bold text-3xl text-center mb-8 sm:text-4xl'>
				Search Hastags
			</h2>

			<div className='flex items-center relative bg-neutral-600 rounded-2xl border-2 border-transparent has-[input:focus]:border-neutral-100 w-[min(41rem,100%-2rem)] mx-auto'>
				<Image
					src='/assets/icons/search.svg'
					alt=''
					width={24}
					height={24}
					className='ml-5'
				/>
				<TextInput
					name='search-term'
					placeholder='Search creators, hashtags, keywords...'
					className='w-[calc(100%-.25rem)] outline-none border-none'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>

				{isPending && (
					<Loader className='mx-auto my-2 absolute top-2 right-10' />
				)}
			</div>

			<PopularTags />
		</header>
	)
}

'use client'

import { TextInput } from '@/components/elements'
import Loader from '@/components/loader'
import { useDebounce, useUpdateEffect } from '@/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ExploreHeader({ searchTerm }: { searchTerm: string }) {
	const router = useRouter()
	const [search, setSearch] = useState(searchTerm ?? '')
	const { debouncedValue, isPending } = useDebounce(search)

	useUpdateEffect(() => {
		router.replace(search.length ? `/explore?search=${search}` : '/explore')
	}, [debouncedValue])

	useEffect(() => setSearch(searchTerm), [searchTerm])

	return (
		<header>
			<h2 className='font-bold text-3xl text-center mb-8 sm:text-4xl'>
				Explore Snapgram
			</h2>

			<div className='flex items-center relative bg-neutral-600 rounded-2xl border-2 border-transparent has-[input:focus]:border-neutral-100 w-[min(41rem,100%-2rem)] mx-auto px-5'>
				<Image
					src='/assets/icons/search.svg'
					alt=''
					width={24}
					height={24}
				/>
				<TextInput
					name='search-term'
					placeholder='Search creators, hashtags, keywords...'
					className='w-[calc(100%-.25rem)] [&>input]:outline-none [&>input]:border-none'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>

				{isPending && (
					<Loader className='mx-auto my-2 absolute top-2 right-10' />
				)}

				{!isPending && !!searchTerm.length && (
					<Link href='/explore'>Clear</Link>
				)}
			</div>
		</header>
	)
}

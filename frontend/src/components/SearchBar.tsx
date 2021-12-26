import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getSearchResults } from '../utils/api'

interface SearchBarProps {
	onResultsRetrieved: (results: string[]) => void
}

const SearchBar = ({ onResultsRetrieved }: SearchBarProps) => {
	const [input, setInput] = useState<string | undefined>()
	const [query, setQuery] = useState<string | undefined>()
	const { data: { results } = {} } = useQuery(['search', query], () => getSearchResults(query), {
		enabled: !!query,
	})

	useEffect(() => {
		results && onResultsRetrieved(results)
	}, [results])

	return (
		<div className="flex w-3/4 h-8 px-3 border border-gray-200 shadow md:w-1/2 rounded-2xl">
			<input
				type="text"
				className="flex-1 outline-none"
				onKeyDown={({ key }) => key === 'Enter' && setQuery(input)}
				onChange={({ target: { value } }) => setInput(value)}
			/>
			<button onClick={() => setQuery(input)}>🔍</button>
		</div>
	)
}

export default SearchBar

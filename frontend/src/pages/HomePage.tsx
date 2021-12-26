import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'

const HomePage = () => {
	const [results, setResults] = useState<string[]>([])

	const handleResultsRetrieved = (results: string[]) => setResults(results)

	return (
		<main className="flex flex-col items-center space-y-4 sm:space-y-8">
			<div
				className={`${
					results.length === 0 ? 'pt-40' : 'pt-4 sm:pt-8'
				} text-2xl sm:text-5xl`}
			>
				Reverse Dictionary
			</div>
			<SearchBar onResultsRetrieved={handleResultsRetrieved} />
			<SearchResults results={results} />
		</main>
	)
}

export default HomePage

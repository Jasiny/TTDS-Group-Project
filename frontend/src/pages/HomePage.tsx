import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'

const HomePage = () => {
	const [results, setResults] = useState<GetSearchResultsResponseProps>()

	const handleResultsRetrieved = (results: GetSearchResultsResponseProps) => setResults(results)

	return (
		<main className="flex flex-col items-center space-y-4 sm:space-y-8">
			<div className={`${results ? 'pt-4 sm:pt-8' : 'pt-40'} text-2xl sm:text-5xl`}>
				Reverse Dictionary
			</div>
			<SearchBar onResultsRetrieved={handleResultsRetrieved} />
			{results && <SearchResults results={results} />}
		</main>
	)
}

export default HomePage

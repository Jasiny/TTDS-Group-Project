import React, { useState } from 'react'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import SettingButton from '../components/SettingButton'
import { EngineType } from '../utils/enums'

const HomePage = () => {
	const [results, setResults] = useState<GetSearchResultsResponseProps>()
	const [engineType, setEngineType] = useState<EngineType>(EngineType.Neural)

	const handleResultsRetrieved = (results: GetSearchResultsResponseProps) => setResults(results)

	const handleFilterChanged = (engineType: EngineType) => setEngineType(engineType)

	return (
		<main className="relative flex flex-col items-center space-y-4 sm:space-y-6">
			{/* setting button at right top corner */}
			<div className="absolute right-4 top-1">
				<SettingButton />
			</div>
			{/* logo */}
			<div
				onClick={() => location.reload()}
				style={{ fontFamily: 'Courgette' }}
				className={`${
					results ? 'pt-4 sm:pt-8' : 'pt-40'
				} text-2xl sm:text-7xl hover:cursor-pointer`}
			>
				Find my words
			</div>
			<SearchBar engine={engineType} onResultsRetrieved={handleResultsRetrieved} />
			{results && (
				<>
					<FilterBar onFilterChanged={handleFilterChanged} />
					<SearchResults results={results} />
				</>
			)}
		</main>
	)
}

export default HomePage

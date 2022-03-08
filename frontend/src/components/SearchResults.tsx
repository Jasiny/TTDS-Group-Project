import React from 'react'

interface SearchResultsProps {
	results: GetSearchResultsResponseProps
}

const SearchResults = ({ results: { words } }: SearchResultsProps) => {
	const prob2color = (prob: number) =>
		prob > 3
			? `linear-gradient(to left, rgba(70, 130, 180, ${prob / 50}) ${prob}%, white ${prob}%)`
			: undefined

	return (
		<section className="grid grid-cols-3 gap-y-1 sm:grid-flow-col sm:grid-rows-25 md:grid-rows-20">
			{words.map(({ word, score }, index) => (
				<div
					key={index}
					className="flex justify-between px-2 space-x-4 text-lg text-right sm:px-8 lg:px-12"
				>
					<span className="text-gray-500 tabular-nums">{`${index + 1}. `}</span>
					<span
						className="flex-1 hover:cursor-pointer hover:underline"
						style={{ background: prob2color((Number(score) / (index + 1)) * 100) }}
						// style={{ background: prob2color(Number(score) * 100) }}
					>
						{word.replace('_', ' ')}
					</span>
				</div>
			))}
		</section>
	)
}

export default SearchResults

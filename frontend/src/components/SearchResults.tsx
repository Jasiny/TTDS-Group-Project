import { ClickAwayListener, Fade, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { POSType, WordType } from '../utils/enums'
import DefinitionCard from './DefinitionCard'

interface SearchResultsProps {
	wordType: WordType
	posType: POSType
	results: GetSearchResultsResponseProps
}

const SearchResults = ({ wordType, posType, results: { words } }: SearchResultsProps) => {
	const [clickedIndex, setClickedIndex] = useState<number | undefined>(undefined)

	const prob2color = (prob: number) =>
		prob > 3
			? `linear-gradient(to left, rgba(70, 130, 180, ${prob / 50}) ${prob}%, white ${prob}%)`
			: undefined

	return (
		<section className="grid grid-cols-3 gap-y-1 sm:grid-flow-col sm:grid-rows-25 md:grid-rows-20">
			{words
				.filter(({ word }, i, a) => (a[i - 1] ? word !== a[i - 1].word : true))
				.filter(({ word }) => {
					const isPhrase = word.includes('_')
					switch (wordType) {
						case WordType.All:
							return true
						case WordType.Phrase:
							return isPhrase
						case WordType.Word:
							return !isPhrase
						default:
							break
					}
				})
				.filter(({ pos }) =>
					posType == POSType.All ? true : pos.includes(posType.toLowerCase())
				)
				.slice(0, 100)
				.map(({ word, pos, defitions, score }, index) => (
					<div
						key={index}
						className="flex justify-between px-2 space-x-4 text-lg text-right sm:px-8 lg:px-12"
					>
						<span className="text-gray-500 tabular-nums">{`${index + 1}. `}</span>
						<ClickAwayListener
							onClickAway={() => index === clickedIndex && setClickedIndex(undefined)}
						>
							<Tooltip
								placement="right"
								disableFocusListener
								disableHoverListener
								disableTouchListener
								className="max-h-16"
								TransitionComponent={Fade}
								title={
									<DefinitionCard word={word} pos={pos} defitions={defitions} />
								}
								open={index === clickedIndex}
								PopperProps={{ disablePortal: true }}
							>
								<span
									onClick={() => setClickedIndex(index)}
									className="flex-1 hover:cursor-pointer hover:underline line-clamp-1"
									// style={{ background: prob2color((Number(score) / (index + 1)) * 100) }}
									style={{ background: prob2color(Number(score) * 100) }}
								>
									{word.replaceAll('_', ' ')}
								</span>
							</Tooltip>
						</ClickAwayListener>
					</div>
				))}
		</section>
	)
}

export default SearchResults

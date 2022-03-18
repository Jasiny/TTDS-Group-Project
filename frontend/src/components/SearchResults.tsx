import {
	Alert,
	ClickAwayListener,
	Fade,
	Snackbar,
	Tooltip,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import { POSType, WordType } from '../utils/enums'
import DefinitionCard from './DefinitionCard'

interface SearchResultsProps {
	wordType: WordType
	posType: POSType
	showScore: boolean
	results: GetSearchResultsResponseProps
}

const SearchResults = ({
	wordType,
	posType,
	showScore,
	results: { words },
}: SearchResultsProps) => {
	const [clickedIndex, setClickedIndex] = useState<number | undefined>(undefined)
	const [showSnackbar, setShowSnackbar] = useState(false)
	const bigScreen = useMediaQuery(useTheme().breakpoints.up('sm'))
	const queryClient = useQueryClient()

	const score2color = (scoreString: string, i: number) => {
		const score = Number(scoreString)
		const norm = Number(words[0].score)
		return `linear-gradient(to left, rgba(70, 130, 180, ${score / norm / (0.1 * i + 1)}) ${
			score * 100
		}%, white ${score * 100}%)`
	}

	const removeDuplicates = (arr: WordProps[]) => {
		const words = arr.map((a) => a.word)
		return arr.filter(({ word }, i) => !words.includes(word, i + 1))
	}

	return (
		<>
			<section
				className={
					bigScreen
						? 'grid w-full gap-y-1 grid-flow-col sm:grid-rows-25 md:grid-rows-20 px-40'
						: 'grid w-full gap-y-1 grid-cols-2 px-4'
				}
			>
				{removeDuplicates(words)
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
					.sort((a, b) => Number(b.score) - Number(a.score))
					.map(({ word, pos, defitions, score }, index) => (
						<div
							key={index}
							className="flex justify-between pl-2 text-lg text-right sm:pl-8 lg:pl-12"
						>
							<span className="text-gray-500 tabular-nums">{`${index + 1}. `}</span>
							<ClickAwayListener
								onClickAway={() =>
									index === clickedIndex && setClickedIndex(undefined)
								}
							>
								<Tooltip
									placement="right"
									className="flex-1"
									disableFocusListener
									disableHoverListener
									disableTouchListener
									TransitionComponent={Fade}
									title={
										<DefinitionCard
											word={word}
											pos={pos}
											defitions={defitions}
											onFeedbackBtnClicked={() => {
												setShowSnackbar(true)
												queryClient.refetchQueries('search')
											}}
										/>
									}
									open={index === clickedIndex}
									PopperProps={{ disablePortal: true }}
								>
									<span
										onClick={() => setClickedIndex(index)}
										style={{ background: score2color(score, index) }}
										className="hover:cursor-pointer hover:underline line-clamp-1 bg-cyan-800"
									>
										{`${word.replaceAll('_', ' ')}${
											showScore ? ` (${score})` : ''
										}`}
									</span>
								</Tooltip>
							</ClickAwayListener>
						</div>
					))}
			</section>
			<Snackbar
				open={showSnackbar}
				autoHideDuration={3000}
				onClose={() => setShowSnackbar(false)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert severity="success">Feedback sent! Thanks!</Alert>
			</Snackbar>
		</>
	)
}

export default SearchResults

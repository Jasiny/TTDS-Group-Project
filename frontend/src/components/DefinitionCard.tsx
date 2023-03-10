import { SentimentSatisfiedAlt, SentimentVeryDissatisfied } from '@mui/icons-material'
import { ButtonGroup, Chip, IconButton } from '@mui/material'
import React from 'react'
import { postFeedback } from '../utils/api'

interface DefinitionCardProps {
	word: string
	pos: string[]
	defitions: string[]
	onFeedbackBtnClicked: () => void
}

const DefinitionCard = ({ word, pos, defitions, onFeedbackBtnClicked }: DefinitionCardProps) => {
	const printDefinition = (i: number, d: string) => {
		d = d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()
		if (!d.endsWith('.')) {
			d = d + '.'
		}
		return `${i + 1}. ${d}`
	}

	return (
		<section className="px-4 py-2 space-y-1 text-left border rounded shadow">
			<div className="text-2xl text-black capitalize">{word.replaceAll('_', ' ')}</div>
			<div className="space-x-1 text-xl text-black">
				{pos.map((p, i) => (
					<Chip key={i} label={p} size="small" variant="outlined" />
				))}
			</div>
			<div className="overflow-y-auto text-gray-600 max-h-96">
				{defitions
					.filter(
						(d) =>
							defitions.length == 1 ||
							(d.split(' ').length > 1 && d.split(' ').length <= 15)
					)
					.map((d, i) => (
						<p key={i} className="text-sm">
							{printDefinition(i, d)}
						</p>
					))}
			</div>
			<div className="flex justify-end">
				<ButtonGroup size="large">
					<IconButton
						style={{ color: 'green' }}
						onClick={() => {
							postFeedback(word, 1)
							onFeedbackBtnClicked()
						}}
					>
						<SentimentSatisfiedAlt />
					</IconButton>
					<IconButton
						style={{ color: 'red' }}
						onClick={() => {
							postFeedback(word, -1)
							onFeedbackBtnClicked()
						}}
					>
						<SentimentVeryDissatisfied />
					</IconButton>
				</ButtonGroup>
			</div>
		</section>
	)
}

export default DefinitionCard

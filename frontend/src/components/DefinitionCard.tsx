import { SentimentSatisfiedAlt, SentimentVeryDissatisfied } from '@mui/icons-material'
import { ButtonGroup, Chip, IconButton } from '@mui/material'
import React from 'react'

interface DefinitionCardProps {
	word: string
	pos: string[]
	defitions: string[]
}

const DefinitionCard = ({ word, pos, defitions }: DefinitionCardProps) => {
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
							{`${i + 1}. ${
								d.charAt(0).toUpperCase() + d.slice(1).toLowerCase() + '.'
							}`}
						</p>
					))}
			</div>
			<div className="flex justify-end">
				<ButtonGroup size="large">
					<IconButton style={{ color: 'green' }}>
						<SentimentSatisfiedAlt />
					</IconButton>
					<IconButton style={{ color: 'red' }}>
						<SentimentVeryDissatisfied />
					</IconButton>
				</ButtonGroup>
			</div>
		</section>
	)
}

export default DefinitionCard

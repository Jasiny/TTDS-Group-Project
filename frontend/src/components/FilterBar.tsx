import { Switch, Typography } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { EngineType } from '../utils/enums'

interface FilterBarProps {
	onFilterChanged: (engineType: EngineType) => void
}

const FilterBar = ({ onFilterChanged }: FilterBarProps) => {
	const [engineType, setEngineType] = useState(EngineType.Neural)
	const [checked, setChecked] = useState(true)

	const handleChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
		const engine = checked ? EngineType.Neural : EngineType.Traditional
		setChecked(checked)
		setEngineType(engine)
		onFilterChanged(engine)
	}

	return (
		<div className="flex items-center justify-between">
			<div>
				<Typography variant="h6" gutterBottom component="span">
					<span>Current Engine:</span>
					<span className={engineType == EngineType.Neural ? 'text-purple-700' : ''}>
						{` ${engineType} IR System`}
					</span>
				</Typography>
				<Switch checked={checked} onChange={handleChange} />
			</div>
		</div>
	)
}

export default FilterBar

import RefreshIcon from '@mui/icons-material/Refresh'
import { IconButton, MenuItem, Switch, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { EngineType, POSType, WordType } from '../utils/enums'

interface FilterBarProps {
	onFilterChanged: (filter: FilterProps) => void
}

const FilterBar = ({ onFilterChanged }: FilterBarProps) => {
	const [checked, setChecked] = useState(true)
	const [filter, setFilter] = useState({
		engineType: EngineType.Neural,
		wordType: WordType.All,
		posType: POSType.All,
	})

	useEffect(() => {
		onFilterChanged(filter)
		setChecked(filter.engineType == EngineType.Neural)
	}, [filter])

	const handleSwitchChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
		const engine = checked ? EngineType.Neural : EngineType.Traditional
		setChecked(checked)
		setFilter({ ...filter, engineType: engine })
	}

	return (
		<section className="flex items-center justify-between space-x-20">
			<div className="space-x-4">
				<Typography variant="h6" component="span">
					<span>Current Engine:</span>
					<span
						className={filter.engineType == EngineType.Neural ? 'text-purple-700' : ''}
					>
						{` ${filter.engineType} IR System`}
					</span>
				</Typography>
				<Switch checked={checked} onChange={handleSwitchChange} />
			</div>
			<div className="space-x-4">
				<Typography variant="h6" component="span">
					<span>Type:</span>
				</Typography>
				<Select
					value={filter.wordType}
					sx={{ width: 100 }}
					onChange={({ target: { value } }: SelectChangeEvent) =>
						setFilter({ ...filter, wordType: value as WordType })
					}
				>
					<MenuItem value={WordType.All}>All</MenuItem>
					<MenuItem value={WordType.Word}>{WordType.Word}</MenuItem>
					<MenuItem value={WordType.Phrase}>{WordType.Phrase}</MenuItem>
				</Select>
			</div>
			<div className="space-x-4">
				<Typography variant="h6" component="span">
					<span>POS:</span>
				</Typography>
				<Select
					value={filter.posType}
					sx={{ width: 100 }}
					onChange={({ target: { value } }: SelectChangeEvent) =>
						setFilter({ ...filter, posType: value as POSType })
					}
				>
					<MenuItem value={POSType.All}>All</MenuItem>
					<MenuItem value={POSType.Noun}>{POSType.Noun}</MenuItem>
					<MenuItem value={POSType.Verb}>{POSType.Verb}</MenuItem>
					<MenuItem value={POSType.Adj}>{POSType.Adj}</MenuItem>
					<MenuItem value={POSType.Adv}>{POSType.Adv}</MenuItem>
				</Select>
			</div>
			<IconButton
				onClick={() =>
					setFilter({
						engineType: EngineType.Neural,
						wordType: WordType.All,
						posType: POSType.All,
					})
				}
			>
				<RefreshIcon color="primary" titleAccess="Reset to default" />
			</IconButton>
		</section>
	)
}

export default FilterBar

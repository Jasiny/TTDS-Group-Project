import { Close, Settings } from '@mui/icons-material'
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Switch,
	Tab,
	Tabs,
	Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { ChangeEvent, SyntheticEvent, useState } from 'react'
import { EngineType } from '../utils/enums'

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
	<div
		role="tabpanel"
		className="w-full"
		id={`tabpanel-${index}`}
		hidden={value !== index}
		{...other}
	>
		{value === index && (
			<Box sx={{ px: 5, py: 3 }}>
				<Typography>{children}</Typography>
			</Box>
		)}
	</div>
)

const SettingDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(0),
	},
	'& .MuiTabs-scroller': {
		marginRight: '3rem !important',
	},
}))

const SettingDialogTitle = ({ children, onClose, ...other }: DialogTitleProps) => (
	<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
		{children}
		{onClose ? (
			<IconButton
				onClick={onClose}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<Close />
			</IconButton>
		) : null}
	</DialogTitle>
)

const SettingButton = () => {
	const [tabvalue, setTabValue] = useState(0)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [engineType, setEngineType] = useState(EngineType.Neural)
	const [checked, setChecked] = useState(true)

	const handleChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
		setChecked(checked)
		setEngineType(checked ? EngineType.Neural : EngineType.Traditional)
	}

	return (
		<>
			{/* Icon */}
			<IconButton size="large" onClick={() => setIsDialogOpen(true)}>
				<Settings />
			</IconButton>
			{/* Dialog */}
			<SettingDialog
				onClose={() => setIsDialogOpen(false)}
				open={isDialogOpen}
				fullWidth={true}
				maxWidth="md"
			>
				<SettingDialogTitle
					id="setting-dialog-title"
					onClose={() => setIsDialogOpen(false)}
				>
					Settings
				</SettingDialogTitle>
				<DialogContent dividers>
					<Box
						sx={{
							flexGrow: 1,
							height: 300,
							display: 'flex',
							bgcolor: 'background.paper',
						}}
					>
						<Tabs
							value={tabvalue}
							orientation="vertical"
							sx={{ borderRight: 1, borderColor: 'divider' }}
							onChange={(_: SyntheticEvent, newValue: number) =>
								setTabValue(newValue)
							}
						>
							<Tab label="System" id={`tab-${0}`} />
							<Tab label="About" id={`tab-${1}`} />
						</Tabs>
						{/* ================================================================ */}
						<TabPanel value={tabvalue} index={0}>
							<div className="flex items-center justify-between">
								<Typography variant="h6" gutterBottom component="span">
									<span>Current Engine:</span>
									<span
										className={
											engineType == EngineType.Neural ? 'text-purple-700' : ''
										}
									>
										{` ${engineType} IR System`}
									</span>
								</Typography>
								<Switch checked={checked} onChange={handleChange} />
							</div>
						</TabPanel>
						<TabPanel value={tabvalue} index={1}>
							<Typography variant="h6" gutterBottom component="div">
								TTDS Group 34 All Rights Reserved.
							</Typography>
						</TabPanel>
					</Box>
				</DialogContent>
			</SettingDialog>
		</>
	)
}

export default SettingButton

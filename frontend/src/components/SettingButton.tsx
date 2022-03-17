import { Close, HelpOutline } from '@mui/icons-material'
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Link,
	Tab,
	Tabs,
	Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { SyntheticEvent, useState } from 'react'

const examples = [
	'a place with teacher and students',
	'a place with doctors and patients',
	'a road that cars can go through quickly',
	'best food in UK',
]

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
	<div
		role="tabpanel"
		className="w-full"
		id={`tabpanel-${index}`}
		hidden={value !== index}
		{...other}
	>
		{value === index && <Box sx={{ px: 5, py: 3 }}>{children}</Box>}
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

interface SettingButtonProps {
	onExampleClicked: (example: string) => void
}

const SettingButton = ({ onExampleClicked }: SettingButtonProps) => {
	const [tabvalue, setTabValue] = useState(0)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	return (
		<>
			{/* Icon */}
			<IconButton size="large" onClick={() => setIsDialogOpen(true)}>
				<HelpOutline />
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
					<span style={{ fontFamily: 'Cinzel' }}>Reverse Dictionary</span>
				</SettingDialogTitle>
				<DialogContent dividers>
					<Box
						sx={{
							flexGrow: 1,
							height: 400,
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
							<Tab label="About" id={`tab-${0}`} />
							<Tab label="Term of use" id={`tab-${1}`} />
						</Tabs>
						{/* ================================================================ */}
						<TabPanel value={tabvalue} index={0}>
							<Typography variant="h6" gutterBottom>
								Q: What is this website?
							</Typography>
							<Typography variant="body1" gutterBottom>
								A: Findmywords.org is a website that provides users with a reverse
								dictionary searching.
							</Typography>
							<Typography variant="h6" gutterBottom>
								Q: What is this reverse dictionary?
							</Typography>
							<Typography variant="body1" gutterBottom>
								A: Reverse dictionary is a tool that you can query a description
								sentence about a English word or phrase, then the search engine will
								return a ranked list of most related words to your input query.
							</Typography>
							<Typography variant="body1" gutterBottom>
								Here are some example queries, feel free to click and see the
								results:
							</Typography>
							<div>
								{examples.map((example, i) => (
									<Button
										key={i}
										variant="outlined"
										sx={{ margin: 1 }}
										onClick={() => {
											onExampleClicked(example)
											setIsDialogOpen(false)
										}}
									>
										<span className="lowercase">{example}</span>
									</Button>
								))}
							</div>
						</TabPanel>
						<TabPanel value={tabvalue} index={1}>
							<Typography variant="body1" gutterBottom>
								The website was built by TTDS Group 34.
							</Typography>
							<Typography variant="body1" gutterBottom>
								We take care of your personal privacy. We did not use any cookie
								data and your searching records will not be stored on the server.
								However, your feedback on each word (the face icon you may click on
								the definition card) will be sent to the server but we only save it
								in the memory rather than in physical disk. After restarting the
								server, all your feedback data will be deleted.
							</Typography>
							<Typography variant="body1" gutterBottom>
								When building the website, we used the following properties:
							</Typography>
							<Typography variant="body1" gutterBottom>
								- Google Fonts (Open Font License):
							</Typography>
							<Typography variant="body1" gutterBottom sx={{ paddingLeft: 3 }}>
								Courgette:
								<Link
									href="https://fonts.google.com/specimen/Courgette"
									underline="none"
									target="_blank"
									sx={{ paddingLeft: 1 }}
								>
									https://fonts.google.com/specimen/Courgette
								</Link>
							</Typography>
							<Typography variant="body1" gutterBottom sx={{ paddingLeft: 3 }}>
								Cinzel:
								<Link
									href="https://fonts.google.com/specimen/Cinzel"
									underline="none"
									target="_blank"
									sx={{ paddingLeft: 1 }}
								>
									https://fonts.google.com/specimen/Cinzel
								</Link>
							</Typography>
							<Typography variant="body1" gutterBottom>
								- MUI Component Library (MIT license):
								<Link
									href="https://mui.com/"
									underline="none"
									target="_blank"
									sx={{ paddingLeft: 1 }}
								>
									https://mui.com/
								</Link>
							</Typography>
							<Typography variant="body1" gutterBottom component="div">
								For other parts in website, TTDS Group 34 All Rights Reserved.
							</Typography>
						</TabPanel>
					</Box>
				</DialogContent>
			</SettingDialog>
		</>
	)
}

export default SettingButton

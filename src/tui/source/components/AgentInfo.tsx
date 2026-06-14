import React from 'react';
import { Box, Text } from 'ink';

export function AgentInfo({ model, directory }:{ model: string, directory: string}) {
// error:    '✖ error',
	return (
		<Box alignItems="center" flexGrow={1}>
		<Box
			flexDirection="column"
			paddingX={2}
			paddingY={1}
			borderStyle="round"
			borderColor="gray"
			gap={1}
			justifyContent='center'
			minWidth={40}
		>
			<Box gap={1}><Text bold color="#bbaffa">Tireless Agent</Text><Text color="grey">v0.4</Text></Box>
			<Box marginTop={1} flexDirection="column" gap={0}>
				<Box gap={1}>
					<Text color="#aaa">model:   </Text>
					<Text color="#bbaffa">{model}</Text>
				</Box>
				<Box gap={1}>
					<Text color="#aaa">directory:</Text>
					<Text color="#bbaffa" wrap="truncate-end">{directory || process.cwd()}</Text>
				</Box>
				<Box gap={1}>
					<Text color="#aaa">sandbox:</Text>
					<Text color="#bbaffa">ON (Docker)</Text>
				</Box>

			</Box>
		</Box>
		</Box>
	);
}

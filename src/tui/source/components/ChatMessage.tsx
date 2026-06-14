import React from 'react';
import { Box, Text } from 'ink';
import { LLMDisplayMessage } from './ChatHistory.js';

export function ChatMessage({ data }: { data: LLMDisplayMessage }) {
	return (
		data.role === 'user' ? (
			<Box
			  borderStyle="round"
			  borderDimColor
			  borderColor="gray"
			  flexDirection="row"
			  paddingX={1}
			  gap={1}
			>
			<Text bold color="grey">></Text>
				<Text color="grey">{data.content}</Text>
			</Box>
		) : (
			<Box>
			</Box>
		)
	);
}

import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import { LLMDisplayMessage } from './ChatHistory.js';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { useState } from 'react';

export function ChatMessage({ data }: { data: LLMDisplayMessage }) {
	let [parsed,setParsed] = useState<string>('');
	marked.use(markedTerminal());
	useEffect(() => {
		if (data.content) {
			const parsedContent = marked.parse(data.content);
			setParsed(parsedContent);
		}
	})
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
				<Text bold color="grey">{data.content}</Text>
			</Box>
		) : (

			data.role === 'assistant' ? (
				<Box paddingX={1}>
					<Text color="green">{parsed}</Text>
				</Box>
			) : (
				<Box
					paddingX={1}
				>
					<Text color="yellow" dimColor>{data.content}</Text>
				</Box>
			)
		)
	);
}

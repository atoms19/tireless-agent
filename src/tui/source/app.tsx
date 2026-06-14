import React, { useState } from 'react';
import { Box, Text } from 'ink';

import { Header } from './components/Header';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { LLMDisplayMessage } from './components/ChatHistory.js';


export function App() {
	const [inputValue, setInputValue] = useState('');
	const [messages, setMessages] = useState<LLMDisplayMessage[]>([]);
	const [isStreaming, setIsStreaming] = useState(false);
	let model = "gpt-3.5-turbo";
	let effort = "low";
	let contextUsed = 0
	let contextLimit = 4096;

	function handleSubmit() {
		if (inputValue.trim() === '') return;
		setIsStreaming(true);
		messages.push({ role: 'user', content: inputValue, });
		setInputValue('');
		setTimeout(()=>{
			setIsStreaming(false)
		}, 2000)
	}

	return (
		<Box flexDirection="column">
			<Header model="gpt-3.5-turbo" directory="/path/to/agent"/>
			<Box flexDirection="column" >
				<ChatHistory
					Messages={messages}
				/>
			</Box>
			<Box gap={1} marginTop={1} paddingX={1}>
			{isStreaming &&
				<Text color={'yellow'} bold>
				◌ working on it…
				</Text>
			}
			</Box>
			<ChatInput
				value={inputValue}
				onChange={setInputValue}
				onSubmit={handleSubmit}
			/>
			<Box marginX={2} marginBottom={0} gap={2} justifyContent="space-between">
				<Text dimColor>{process.cwd()}</Text>
				<Box gap={2}>
					<Text color="gray" >{model}•{effort}</Text>
					<Text color="gray" >{contextUsed}/{contextLimit}</Text>
				</Box>
			</Box>
		</Box>
	);
}

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { Header } from './components/Header';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { LLMDisplayMessage } from './components/ChatHistory.js';
import { useApp, useInput } from 'ink';

export function App({
	client,
	session,
	environment,
	defaultModel,
	effort
}: {
	client: any;
	session: any;
	environment: any;
	defaultModel?: string;
	effort?: string;
}) {
	const [inputValue, setInputValue] = useState('');
	const [messages, setMessages] = useState<LLMDisplayMessage[]>([]);
	const [isChatInitialized, setIsChatInitialized] = useState(false);
	const [isStreaming, setIsStreaming] = useState(false);
	let model = defaultModel || "gpt-oss(120b)";
	let currentEffort = effort || "low";
	let contextUsed = 0
	let contextLimit = 4096;

	const { exit } = useApp();

	useInput(async (input, key) => {
		if (key.ctrl && input === 'd') {
			console.log("Stopping environment and exiting...")
			await environment.stopEnvironment();
			exit();
		}
	})


	async function handleSubmit() {

		if (inputValue.trim() === '') return;
		setIsStreaming(true);
		messages.push({ role: 'user', content: inputValue, });
		setInputValue('');
		if (!isChatInitialized) {

			await client.chat([
				{
					role: "user",
					content: inputValue
				}
			])

			let messagesR = await session.retrieveSession(client.currentSessionId)
			setMessages(messagesR)
			setIsChatInitialized(true);

		} else {

			let history: any[] = await session.retrieveSession(client.currentSessionId)
			if (!history) return;
			await client.chat([...history, {
				role: "user",
				content: inputValue
			}], true)
			history = await session.retrieveSession(client.currentSessionId)
			setMessages(history)
		}

		setIsStreaming(false)

	}

	return (
		<Box flexDirection="column">
			<Header model={defaultModel} directory={process.cwd().replace("/home/*/","~")} />
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
					<Text color="gray" >{model}•{currentEffort}</Text>
					<Text color="gray" >{contextUsed}/{contextLimit}</Text>
				</Box>
			</Box>
		</Box>
	);
}

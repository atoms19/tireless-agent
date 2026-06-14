import React from 'react';
import { Box } from 'ink';
import { ChatMessage } from './ChatMessage.js';

export interface LLMDisplayMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}


export function ChatHistory({Messages}:{Messages:LLMDisplayMessage[]}) {
	return (
		<Box flexDirection="column" gap={0} >
        {Messages.map((message:LLMDisplayMessage,i)=>(<ChatMessage key={i} data={message} />))}
		</Box>
	);
}

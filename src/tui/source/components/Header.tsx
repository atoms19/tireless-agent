import React from 'react';
import { Box } from 'ink';
import { Logo } from './Logo';
import { AgentInfo } from './AgentInfo';


export function Header({ model, directory }:{ model: string, directory: string}) {
	return (
		<Box flexDirection="row" gap={1}>
			<Logo />
			<AgentInfo model={model} directory={directory}/>
		</Box>
	);
}

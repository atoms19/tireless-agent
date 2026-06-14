import React from 'react';
import { Box, Text } from 'ink';

const LOGO = `
                 ▓▓▓
                  ▓
                  ▓
       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
       ▓░░░░░░░░░░░░░░░░░░░░░▓
       ▓░░░▓░░░░░░░░░░░░▓░░░░▓
       ▓░░▓▓▓░░░░░░░░░░▓▓▓░░░▓
       ▓░░░░░░░░░░░░░░░░░░░░░▓
       ▓░░░░░░▓▓▓▓▓▓▓▓░░░░░░░▓
       ▓░░░░░░░░░░░░░░░░░░░░░▓
       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
`;
export function Logo() {
	return (
	<Box
      alignItems='center'
	>
		<Box
			paddingX={2}
			paddingY={1}
			alignItems='center'
			justifyContent='center'
			height ={18}
		>
			<Text color="red" dimColor>
				{LOGO}
			</Text>
		</Box>
	</Box>
	);
}

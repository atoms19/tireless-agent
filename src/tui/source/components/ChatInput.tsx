import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';


export function ChatInput({value,onChange,onSubmit,disabled}:{value: string, onChange: (v: string) => void, onSubmit: (v: string) => void, disabled: boolean}) {
	return (
		<Box
			borderStyle="round"
			borderColor={"blueBright"}
			paddingX={1}
			paddingY={0.3}
		>
			<Box gap={1} alignItems="center">
				<Text color="magentaBright" bold>›</Text>
				{disabled ? (
					<Text color="#bbaffa" >waiting for response…</Text>
				) : (
					<TextInput
						value={value}
						onChange={onChange}
						onSubmit={onSubmit}
						placeholder="Implement {feature}"
						focus={!disabled}
					/>
				)}
			</Box>
		</Box>
	);
}

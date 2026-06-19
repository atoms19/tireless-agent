export function extractJsonCandidates(input: string): string[] {
	let results: string[] = [];

	let stack: string[] = [];
	let start = -1;
	let inString = false;
	let escape = false;

	for (let i = 0; i < input.length; i++) {
		const c = input[i];
		if (inString) {
			if (escape) {
				escape = false;
			} else if (c === "\\") {
				escape = true;
			} else if (c === '"') {
				inString = false;
			}
			continue;
		}

		if (c === '"') {
			inString = true;
			continue;
		}

		if (c === "{" || c === "[") {
			if (stack.length === 0) {
				start = i;
			}
			stack.push(c);
			continue;
		}

		if (c === "}" || c === "]") {
			if (stack.length > 0) {
				const lastOpen = stack[stack.length - 1];

				if ((c === "}" && lastOpen === "{") || (c === "]" && lastOpen === "[")) {
					stack.pop();
					
					if (stack.length === 0 && start !== -1) {
						results.push(input.slice(start, i + 1));
						start = -1; // Reset anchor
					}
				} else {
					stack = [];
					start = -1;
				}
			} else {
				start = -1;
			}
		}
	}

	return results;
}

export const toolCallCorrector = (chatMsg: string): boolean => {
	const candidates = extractJsonCandidates(chatMsg);

	for (const c of candidates) {
		try {
			JSON.parse(c);
			return true;
		} catch {}
	}

	return false;
};



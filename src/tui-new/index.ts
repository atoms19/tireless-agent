import {
	StyleValues,
	TermElement,
	TermInput,
	TermText,
	color,
	length,
	run,
} from 'terminosaurus';

export function startTerminalSession() {
	let chatPrompt = '';

	run(screen => {
		const infoContainer = new TermElement();
		const logo = new TermText();
		infoContainer.style.set({
			display: StyleValues.Display.Flex,
			flexDirection: StyleValues.FlexDirection.Row,
		});

		logo.setText(`
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
            `);

		logo.appendTo(infoContainer);
		logo.style.set({
			marginTop: length(1),
			color: color('salmon'),
		});
		const infoText = new TermText();
		infoText.style.set({
			marginLeft: length(5),
			marginTop: length(5),
			whiteSpace: StyleValues.WhiteSpace.Pre,
		});

		infoText.setText(`
TIRELESS AGENT

model: gpt-4-0613
directory: ${chatPrompt}
				  `);
		infoText.style.set({
			width: length(40),
			marginBottom: length(2),
			padding: [length(2), length(1)],
		});
		infoText.appendTo(infoContainer);

		const tx = new TermElement();
		tx.style.set({
			border: StyleValues.Border.Modern,
		});

		logo.style.set({
			padding: [length(1), length(2)],
			whiteSpace: StyleValues.WhiteSpace.Pre,
		});

		const input = new TermInput();
		input.styleManager.setStateStatus(`decorated`, false);
		input.setMultiline(false);
		input.setText(`Hello world`);
		input.style.set({
			marginTop: StyleValues.Length.One,
			whiteSpace: StyleValues.WhiteSpace.PreWrap,
			padding: [length(1), length(1)],
		});

		input.onKeyPress.addEventListener(e => {
			// agentCallerInstance.chat()
			chatPrompt += input.text;
		});

		let text = new TermText();

		infoContainer.appendTo(screen.rootNode);
		input.appendTo(tx);
		tx.appendTo(screen.rootNode);
	});
}

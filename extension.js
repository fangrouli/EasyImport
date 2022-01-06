const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const assert = require('assert');
const python = require('python-bridge');
// @ts-ignore
const py = python();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "easyimport" is now active!');

	// Activation method
	let disposable1 = vscode.commands.registerCommand('easyimport.runEasyImport', function () {
		vscode.window.showInformationMessage('The extension EasyImport has been activated!');
	});

	// Main function
	let disposable2 = vscode.commands.registerCommand('easyimport.FindPathVersion', function () {
		FindPathVersion();
	});

	context.subscriptions.push(disposable1, disposable2);
}

async function FindPathVersion(){
	// Hihglighted text = library name
	const lib = editor.document.getText(editor.selection);

	// Python Scripts to run
	py.ex`import os`;
	py.ex`
		def find(lib_name):
			try:
    			lib = __import__(lib_name)
			except:
    			return "The library <" + lib_name + "> is not found.", None
			path = os.path.dirname(lib.__file__)
			try:
				version = lib.__version__
			except:
				return "The library <" + lib_name + "> do not have version variable.", None
			return "Path: " + path, "Version: " + version`;

	// Returning output and error-handling
	try {
		py`find(${lib})`.then(output => {
			if (output[1] === null) {
				vscode.window.showInformationMessage(output[0]);
				console.log(output[0].toString());
			} else {
				console.log(output[0].toString() + "\n" + output[1].toString());
				vscode.window.showInformationMessage(output[0]);
				vscode.window.showInformationMessage(output[1]);
			};
			console.log('Extension runs successfully!');
		});
	} catch(error) {
		console.log('Error: '+ error);
	};
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

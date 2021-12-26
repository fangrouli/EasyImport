const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 4000;

const assert = require('assert');
const python = require('python-bridge');
// @ts-ignore
const py = python();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "easyimport" is now active!');

	let disposable1 = vscode.commands.registerCommand('easyimport.runEasyImport', function () {
		vscode.window.showInformationMessage('The extension EasyImport has been activated!');
	});

	let disposable2 = vscode.commands.registerCommand('easyimport.FindPathVersion', function () {
		FindPathVersion();
	});

	context.subscriptions.push(disposable1, disposable2);
}

async function FindPathVersion(){
	const lib = editor.document.getText(editor.selection);

	py.ex`import os`

	py.ex`
		def find(lib_name):
			try:
    			lib = __import__(lib_name)
			except:
    			return "The library <" + lib_name + "> is not found."
			path = os.path.dirname(lib.__file__)
			version = lib.__version__
			return "Path: " + path + "Version: " + version`;

	try {
		py`find(${lib})`.then(output => {
			vscode.window.showInformationMessage(output);
			console.log('Successful!')
		});

	} catch(error) {
		console.log('Error: '+error);
	};
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;
const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 4000;

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

function FindPathVersion(){
	const lib = editor.document.getText(editor.selection);

	app.get('/', (req, res) => {
		const pyprog = spawn('C:\Users\fangr\AppData\Local\Programs\Python\Python39', ['Side Module.py', lib], { stdio: 'inherit' });

		pyprog.stdout.on('data', function(data) {
			vscode.window.showInformationMessage(data.toString());
			console.log(data.toString());
			console.log('Successful.');
		});

		pyprog.stderr.on('data', function(data) {
			vscode.window.showInformationMessage('An error occured.');
			console.log('An error occured.');
			console.log('Error code: ' + data.toString());
		});

		pyprog.stderr.pipe(process.stderr);

		pyprog.on('error', (code) => {
			console.log('An error occurred: '+ code.message);
		});

		pyprog.on('close', (code) => {
			console.log(`child process close all stdio with code ${code}`);
		});
	});
	
	app.listen(port, () => console.log('Application listening on port 4000!'));
}

function deactivate() {
	console.log("Thank you for using EasyImport, exiting program...");

	let disposable3 = vscode.commands.registerCommand('easyimport.exitEasyImport', function(){
		vscode.window.showInformationMessage('The extension EasyImport has been terminated!');
	});
}

module.exports = {
	activate,
	deactivate
}

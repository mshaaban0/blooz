#!/usr/bin/env node
const app = require('commander');
const inquirer = require('inquirer');
const bluetooth = require('node-bluetooth');
const device = new bluetooth.DeviceINQ();

app.version('0.0.1')
	// .option('-i, --init', 'output extra debugging')
	.action(init);
app.parse(process.argv);


function init() {
	device.listPairedDevices(function(list){
		const choices = list.map(item => item.name);

		inquirer.prompt([{
			type: 'list',
			message: 'Select your airpods...',
			name: 'deviceName',
			choices
		}]).then(function(answers){
			const chosenDevice = list.filter(item => item.name === answers.deviceName)[0];
			connect(chosenDevice);
		}).catch(function(err){
			console.log('Please choose a device', err);
		});
	});
}


function connect(chosenDevice) {
	device.findSerialPortChannel(chosenDevice.address, function(channel){
		// make bluetooth connect to remote device
		bluetooth.connect(chosenDevice.address, channel, function(err, connection){
			if(err) return console.error('ERRR', err);
			connection.on('data', (buffer) => {
				console.log('received message:', buffer.toString());
			});
			console.log(`Connected to ${chosenDevice.name}`);
			process.exit(1);
		});	
	});
}
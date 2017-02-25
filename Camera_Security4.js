//Program Written By Justin Carey 
//Modules for the LCD screen, Buttons, Email, and Bluetooth
var Sensor = require('jsupm_grove');
var LCD = require('jsupm_i2clcd');
var nodemailer = require("nodemailer");
var bleno = require('bleno');
//Set-up for GPIO pins 
var mraa = require('mraa');
//Print console message that  the camera
process.stdout.write("Project Home Edison Start!");

//Set up email information using node mailer
var email = 'inteledison2017@gmail.com';
var email_pass = 'Csisenior';
var email_service = 'Gmail';
var cammail = nodemailer.createTransport({
    service: email_service,
	auth: {
	    user: email,
	    pass: email_pass
	}
});


//uuid = 'e2c56db5dffb48d2b060d0f5a71096e0',
  // major = 1,
  // minor = 1,
   //measuredPower = -59;


//bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
//console.log('bleno - iBeacon');
//function bluetooth() {
    //bleno.on('stateChange', function (state) {
   // console.log('on -> stateChange: ' + state);

    //if (state === 'poweredOn') {
       // bleno.startAdvertisingIBeacon('e2c56db5dffb48d2b060d0f5a71096e0', 0, 0, -59);
   // } else {
       // bleno.stopAdvertising();
    //}


    //bleno.on('advertisingStart', function () {
       // console.log('on -> advertisingStart');
    //});

    //bleno.on('advertisingStop', function () {
        //console.log('on -> advertisingStop');
    //});
//}


//command line execution function used 
// to activate USB camera from command line later in the code
function run_cmd(cmd, args, callBack) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function () {callBack(resp)});
}
function run_cmd1(cmd) {
    var exec = require('child_process').exec;
    exec(cmd, function (error, stdout, stderr) {
    });
    
}
//Windowalert variable declarations 
var window = new Sensor.GroveButton(7);
var windowSwitch = 0;
//Function for Window Status used in PeriodicActivity Function
function checkWindow() {
    var screen = new LCD.Jhd1313m1(0, 0x3E, 0x62);
    windowSwitch = (windowSwitch == 0) ? 1 : 0;
    

    if (windowSwitch == 1) {
        screen.setCursor(0, 0);
        screen.setColor(0, 50, 25);
        screen.write('The Window is');
        screen.setCursor(-1, 0);
        screen.write('Open!');
        console.log('The Window is Open');
    } else {
        screen.write('The Window is');
        screen.setColor(50, 0, 25);
        screen.setCursor(-1, 0);
        screen.write('Closed!');
        console.log('The Window is Closed!');
    } delay(2000).then(() => { screen.displayOff(); })
}

//Doorlock
var lock = new Sensor.GroveButton(8);
var lockSwitch = 0; 
function checkLock() {
    var screen = new LCD.Jhd1313m1(0, 0x3E, 0x62);
    lockSwitch = (lockSwitch == 0) ? 1 : 0;
    // LightCount to check if switchLight has been previously called.

    if (lockSwitch == 1) {
        screen.setCursor(0, 0);
        screen.write('Frontdoor');
        screen.setCursor(-1, 0);
        screen.write('Unlocked');
        console.log('Frontdoor Unlocked');
    } else {
        screen.setColor(50, 20, 25);
        screen.write('Frontdoor');
        screen.setCursor(-1, 0);
        screen.write('Locked');
        console.log('Frontdoor Locked');
    } delay(2000).then(() => { screen.displayOff(); })
}


//Gas Sensor 
var gas = new Sensor.GroveButton(3);
var gasSwitch = 0;

function checkGas() {
    var screen = new LCD.Jhd1313m1(0, 0x3E, 0x62);
    gasSwitch = (gasSwitch == 0) ? 1 : 0;
    

    if (gasSwitch == 1) {
        screen.setCursor(0, 0);
        screen.setColor(0, 99, 0);
        screen.write('!There is a gas');
        screen.setCursor(-1, 0);
        screen.write('leak! X_X; ')
        console.log('There is gas');
    } else {
        screen.write('There is no gas');
        screen.setCursor(-1, 0);
        screen.write('leak! ^_^ ')
        console.log('There is no Gas!');
    } delay(2000).then(() => { screen.displayOff(); })
}

//Light System  
var light = new Sensor.GroveButton(4);
var lightSwitch = 0;

function LightValue() {
    console.log(light.name() + "value is" + light.value())
}
function switchLight() {
    var screen = new LCD.Jhd1313m1(0, 0x3E, 0x62);
    lightSwitch = (lightSwitch == 0) ? 1 : 0;
    // LightCount to check if switchLight has been previously called.
    // console.log(light.name() + "\n (light) value is" + light.value());

    if (lightSwitch == 1) {
        screen.setCursor(0, 0);
        screen.setColor(90, 90, 0);
        screen.write('Lights are on');
        console.log('Lights are on');
    } else {
        screen.write('Lights are off');
        console.log('Lights are off');
    }
    delay(2000).then(() => { screen.displayOff(); })
}

//Start Doorbell Camera 
var bell = new Sensor.GroveButton(2);

function doorBell() {
    var i = 0;
    //Print activity detected message
    var myLCD = new LCD.Jhd1313m1(0, 0x3E, 0x62);
    //LCD Cursor
    myLCD.setCursor(0, 0);
    myLCD.write('Ring  Ring !');
    delay(2000).then(() => { myLCD.displayOff(); })
    //Remove previously captured picture
    run_cmd("rm", ['-f', '/home/root/img05.jpeg'], function (text) { console.log(text) });
   
    //Take a picture from the USB camera - from command line
    run_cmd("/home/root/bin/ffmpeg/ffmpeg", ['-s','1280x720', '-f', 'video4linux2', '-i', '/dev/video0','-vframes', '1', 'img05.jpeg'],
        function (text) {
            console.log('CMD done, sending email right now...');
            setTimeout(function () {
                cammail.sendMail({
                    from: email,
                    to: 'Garlen63@yahoo.com',
                    subject: "Possible Intruder Alert",
                    text: "A possible intruder has been detected by your Doorbell Camera! Check the picture attached to see if you know this person. Please check and call 911 if you suspect any illegal activity.",
                    attachments: [
                        {
                            filename: 'img05.jpeg',
                            path: '/home/root/img05.jpeg'
                        }
                    ]
                }, function (error, response) { //Sends a status report of the message to the console
                    if (error) {
                        console.log('ERROR', error);
                    } else {
                        console.log("Message sent from: ", response.envelope.from, ' to: ', response.envelope.to[0]);
                    }
                    cammail.close();
                });
                console.log('Message sent!');
            }, 2000);
        });
    // Set a delay of 2000ms and clear the screen
    delay(2000).then(() => { myLCD.displayOff(); });
}

periodicActivity();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
    //Main Activity 
function periodicActivity()
{
   // bluetooth();

    var lockState = (lockSwitch == 0) ? 'Unlocked' : 'Locked';
    console.log('Frontdoor is: ', lockState);
    var l = lock;
    if (l.value() == 1) {
        checkLock();
    }

    var lightState = (lightSwitch == 0) ? 'off' : 'on';
    console.log('The light is: ', lightState);
    // Call light method when button is clicked
    var l = light;
    if (l.value() == 1) {
        switchLight();
    }

    var gasState = (gasSwitch == 0) ? 'off' : 'on';
    console.log('Gas is: ', gasState);
    var g = gas;
    if (g.value() == 1) {
        checkGas();
    }

    var windowAlert = (windowSwitch == 0) ? 'Open' : 'Closed';
    console.log('The window is: ', windowAlert);
    var w = window;
    if (w.value() == 1) {
      checkWindow();
    }

    //Doorbell
    var doorB = bell;
    // function Doorbellvalue() {
    console.log(doorB.name() + "(bell) value is" + doorB.value())
    // }
	//Image Number
    var v = doorB.value();

    //Send email if the Doorbell is Pushed
        if (v == 1) {
	    doorBell();
			
		//To avoid flooding of the user's Inbox with our emails, we want to wait a few seconds
		//(in this case, 30 seconds) before sending another email. The timeout
		//is in milliseconds.  So, for 1 minute, you would use 60000.
		setTimeout(periodicActivity, 900);
	}
	else{ 
		//The button wasn't triggered, so we don't need to wait as long.
		// 1/10 of a second seems about right and allows Edison to do other
		// things in the background.
		setTimeout(periodicActivity, 900);
	}
} 
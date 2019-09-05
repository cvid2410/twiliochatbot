const express = require ("express");
const mongoose = require ("mongoose");
const bodyParser = require ("body-parser");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();
const catme = require("cat-me");
const session = require ("express-session");

const twilio = require ("twilio");
const accountSid = "AC8f9db0123f975063d0fec07d687b2cab"; 
const authToken = "3268094d75f06f836cbb23b09b03e522";

const client = new twilio(accountSid, authToken);

let leadSchema = new mongoose.Schema({

	phoneNumber: String,
	firstName: String,
	lastName: String,
	email: String,
  citizenship: Boolean,
  voterregistration: Boolean,
  jobs: Boolean

});

let Lead = mongoose.model("Lead", leadSchema); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	name: '_es_demo', // The name of the cookie
    secret: '1234', // The secret is required, and is used for signing cookies
    resave: false, // Force save of session for each request.
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {
            
            maxAge: 216000
        }
 }));

mongoose.connect('mongodb+srv://cvides:Dominicanos123@cluster0-ehrfc.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }).then(() => {
	console.log("db connected");
});


var language = "";
let message = "";


app.post('/inbound', (req, res) => {

    var smsCount = req.session.counter || 0;
    message = "Hello Thanks for contacting Dominicanos USA. I'm Doris (the DUSA Bot) I see this is the first time you are contacting us. I will ask some questions to get to know you first.  \n \nBut first, please tell me what is your preferred language?  \n \nPero primero digame, ¿cual es su idioma de preferencia? \n\nEnglish or Spanish?" ;
  	const twiml = new MessagingResponse();

    function sendMessage(message) {
      twiml.message(message);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }

let phone = req.body.From.substring(9, 21);

Lead.find({phoneNumber: phone}, function(err, found) {
  if(found.length!==0){
    message = "seems like we've talked to you before."
  } else {
    let newLead = new Lead();
    newLead.phoneNumber = phone;
    newLead.save(); 

    if(smsCount == 1 && req.body.Body == "English") {
      message = "Would you tell me your first name please?"
    }
  }


});




// ---------------------- Asking for language ----------------------
  if(smsCount == 10 && req.body.Body == "English") {
  		message = "Which of our services are you interested in? \n\nCitizenship \n\nVoter Registration \n\nJobs ";
  		language = "English";

  		req.session.counter = smsCount + 1;

  	} else if (smsCount == 10 && req.body.Body =="Spanish") {
  		message = "you have chosen Spanish";
  		language = "Spanish";

  		req.session.counter = smsCount + 1;

  	} else if(smsCount==10) {
  		message = "Type English or Spanish";
  		sendMessage(message);
  		return; //stops the code from running if user does not choose English or Spanish
  	}


// ---------------------- Asking for type of aid ----------------------


console.log(phone);
console.log(req.session.counter);

if(smsCount == 2 && language == "English" && req.body.Body.toLowerCase() == "jobs") {

      message = "You have chosen jobs. To learn more about the job opportunities we have available to you, please call us or visit our website! \n\n🌎http://dominicanosusa.org/en/tucareer/ \n\n📞+17186650400 ";
      req.session.counter = smsCount + 1;

    } else if(smsCount ==2 && language == "English" && req.body.Body.toLowerCase() == "citizenship" ) {

    message = "You have chosen Citizenship option.\n\nPlease visit the link below to fill out the information required to fill out your N-400 application automatically! \n\nhttps://www.citizenshipworks.org/portal/dusa" + 
    "\n\nNeed help? Watch this video: \nhttps://www.youtube.com/watch?v=r3j5mo2zzcY \n\nNeed in-person help? call us to make an appointment!\n+1(718)665-0400 ";
    req.session.counter = smsCount + 1;

    } else if(smsCount ==2 && language == "English" && req.body.Body.toLowerCase() == "voter registration" ) {

    message = "You have chosen the Voter Registration option.\n\nPlease visit the link below to register to vote: \nvote.gov" + 
    "\n\nNeed in-person help? call us to register you to vote!\n+1(718)665-0400 ";
    req.session.counter = smsCount + 1;

    } else if (smsCount==2) {

      message = " Please choose between Citizenship, Voter Registration, or Jobs";
      sendMessage(message);
      return;
}

if(smsCount==3) {
  message = "got to the end of the dialog questions. Find me a way to bring me to the beginning!";
  sendMessage(message);
  return;
}

    

  req.session.counter = smsCount + 1;
  sendMessage(message);

});

	

 // const twiml = new MessagingResponse();

 // 	twiml.message("hey there what would you need help today with? press C for Citizenship press R for registration"); 

 //    if (req.body.Body == 'C' || req.body.Body == 'c' ) {

	// 	twiml.message().media("https://pbs.twimg.com/profile_images/620467131272945664/RAjiDnXs.jpg");

        
 //    } else {
 //        twiml.message('Hello there, how may I Help you today? Please write C for Citizenship, V for Voter Registration');
   		
 //   		console.log(count);
 //    }

 //    let message = req.body.Body;
 //    console.log(message);

 //    if(req.body.Body == "hi") {

 //    		twiml.message("hello Carlos");


 //    } 

 //    res.writeHead(200, {'Content-Type': 'text/xml'});
 //    res.end(twiml.toString());

// });



// client.messages
//  .create({
//    to: 'whatsapp:+17189028757',
//    from: 'whatsapp:+14155238886',
//    body: "Hola Carlos Vides",
//  })
//  .then((message) => console.log(message.sid));



app.get("/", (req, res) => {
	res.end();
});


app.listen(3000, () => {
	console.log("server connected");
});


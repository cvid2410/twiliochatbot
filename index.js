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

let MessageSchema = new mongoose.Schema({
	phoneNumber: String,
	firstName: String,
	lastName: String,
	typeOfService: String

});

let Message = mongoose.model("Message", MessageSchema); 

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

// mongoose.connect('mongodb+srv://cvides:Dominicanos123@cluster0-ehrfc.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }).then(() => {
// 	console.log("db connected");
// });

// client.messages
// 	.create({
// 		to: 'whatsapp:+17189028757',
// 		from: 'whatsapp:+14155238886',
// 		body: "Hola Carlos Vides",
// 	})
// 	.then((message) => console.log(message.sid));

var choice1 = "";


app.post('/inbound', (req, res) => {

    var smsCount = req.session.counter || 0;
    let message = "-Hi! Thank you for contacting us! I am Doris (the DUSA Bot) and I am here to provide with information about our services. If I cannot answer to your question, please hang in there and a staff member will contact you shortly.  😀 \n \n -Hola! Gracias por escribirnos! Soy Doris (El bot de DUSA) y estoy aquí para brindarle información acerca de los servicios que ofrecemos. Si no le puedo responder a alguna pregunta, por favor, espere un momento y un representante le contactará en breve. \n \n -But first, please tell me what is your preferred language?  \n \n -Pero primero digame, ¿cual es su idioma de preferencia? \n \n -(English or Spanish?)" ;
  	const twiml = new MessagingResponse();

    function sendMessage(message) {
      twiml.message(message);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }


// ---------------------- Asking for language ----------------------
  if(smsCount == 1 && req.body.Body == "English") {
  		message = "Which of our services are you interested in? \n\n Citizenship \n\n Voter Registration \n\n Jobs ";
  		choice1 = "English";

  		req.session.counter = smsCount + 1;

  	} else if (smsCount == 1 && req.body.Body =="Spanish") {
  		message = "you have chosen Spanish";
  		choice1 = "Spanish";

  		req.session.counter = smsCount + 1;

  	} else if(smsCount==1) {
  		message = "Type English or Spanish";
  		sendMessage(message);
  		return; //stops the code from running if user does not choose English or Spanish
  	}


// ---------------------- Asking for type of aid ----------------------

console.log(req.body.Body);
console.log(req.session.counter);
if(smsCount == 2 && choice1 == "English" && req.body.Body == "Jobs") {

      message = "To learn more about the job opportunities we have available to you, please call us or visit our website! \n\n 🌎http://dominicanosusa.org/en/tucareer/ \n\n 📞+17186650400 ";
      sendMessage(message);
      return;

    } else if(smsCount ==2 && choice1 == "English" && req.body.Body == "Citizenship" ) {

    message = "You have chosen citizenship, we have a couple of questions to ask you";

    req.session.counter = smsCount + 1;

    } else if (smsCount==2) {

      message = " Please choose between Citizenship, Voter Registration, or Jobs";
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



app.get("/", (req, res) => {
	res.end();
});


app.listen(3000, () => {
	console.log("server connected");
});


const express = require ("express");
const mongoose = require ("mongoose");
const bodyParser = require ("body-parser");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express();
const session = require ("express-session");

const twilio = require ("twilio");
const accountSid = "yourAccountSid"; 
const authToken = "yourAuthToken";
const client = new twilio(accountSid, authToken);

const Lead = require("./models/LeadSchema");
const connectDB = require("./config/db");

//connect database
connectDB();

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	name: '_es_demo', // The name of the cookie
    secret: '1234', // The secret is required, and is used for signing cookies
    resave: false, // Force save of session for each request.
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {
            
            maxAge: 5*60000
        }
 }));



var language = ""; 
let message = "";
var newContact = true;
var firstName = "";
var lastName = ""
var email = "";


app.post('/inbound', (req, res) => {


// var smsCount = req.session.counter || 0;
const twiml = new MessagingResponse();

function sendMessage(message) {
  twiml.message(message);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}



let newLead = new Lead();
let phone = req.body.From.substring(9, 21);
var smsCount = req.session.counter || 0;



    Lead.find({phoneNumber: phone}, function(err, found) {
    
      if(found.length!==0){
        if(smsCount < 4){
          newContact = true
        } else if(smsCount >= 4) {
          newContact = false;
          Lead.updateOne({phoneNumber: phone}, 
    {$set: {newContact:false}}, {new:true},(err,doc)=>{
      
    }); 
        }
       
      } else {
        newLead.newContact = true;
        newLead.phoneNumber = phone;
        newLead.save(); 
      }

    });

    var idk = true;

    Lead.findOne({phoneNumber:phone}, function() {
      console.log(newContact);
      if(newContact == true){
        idk = false;

      }
      
    });

    console.log(idk);
    
   

if (newContact) {

 
  if(smsCount == 0) {
    message = "Hello Thanks for contacting Dominicanos USA. I'm Doris (the DUSA Bot) I see this is the first time you are contacting us. I will ask some questions to get to know you first.  \n \nBut first, please tell me what is your preferred language?  \n \nPero primero digame, ¿cual es su idioma de preferencia? \n\nEnglish or Spanish?" ;
    req.session.counter = smsCount + 1;
  } 

  if(smsCount == 1 && req.body.Body == "English") {
    message = "May I know your first name please?"
    req.session.counter = smsCount + 1;
  } else if(smsCount==1) {
     message = "Type English or Spanish";
     sendMessage(message);
     return; 
   }

   if(smsCount == 2){
    message = "May I know your last name please?"

    Lead.updateOne({phoneNumber: phone}, 
    {$set: {firstName:req.body.Body}}, {new:true},(err,doc)=>{
      
    }); 

    req.session.counter = smsCount + 1;

   } 
   if(smsCount ==3) {
    message= "May I know your email?"
    
    Lead.updateOne({phoneNumber: phone}, 
    {$set: {lastName:req.body.Body}}, {new:true},(err,doc)=>{
      
    }); 

    req.session.counter = smsCount+1
   } 
   if(smsCount ==4 ){
    
    Lead.updateOne({phoneNumber: phone}, 
    {$set: {email:req.body.Body}}, {new:true},(err,doc)=>{
      
    }); 
    message = "You are an old contact"

    req.session.counter = smsCount+1

   }
   


  } else if (Lead.find({newContact}) == false) {

    console.log("phase2");

    if(smsCount =0) {
       message = "You are an older contact";

    }
  
  }



       
      

  
 


  Lead.updateOne({phoneNumber: phone}, 
    {$set: {smsCount}}, {new:true},(err,doc)=>{
      
  }); 

  req.session.counter = smsCount + 1;
  sendMessage(message);

});

	

app.get("/", (req, res) => {
	res.end();
});


app.listen(3000, () => {
	console.log("server connected");
});




//   } else if(oldContact) {

//     // ---------------------- Asking for type of aid ----------------------

// if(smsCount == 2 && language == "English" && req.body.Body.toLowerCase() == "jobs") {

//       message = "You have chosen jobs. To learn more about the job opportunities we have available to you, please call us or visit our website! \n\n🌎http://dominicanosusa.org/en/tucareer/ \n\n📞+17186650400 ";
//       req.session.counter = smsCount + 1;

//     } else if(smsCount ==2 && language == "English" && req.body.Body.toLowerCase() == "citizenship" ) {

//     message = "You have chosen Citizenship option.\n\nPlease visit the link below to fill out the information required to fill out your N-400 application automatically! \n\nhttps://www.citizenshipworks.org/portal/dusa" + 
//     "\n\nNeed help? Watch this video: \nhttps://www.youtube.com/watch?v=r3j5mo2zzcY \n\nNeed in-person help? call us to make an appointment!\n+1(718)665-0400 ";
//     req.session.counter = smsCount + 1;

//     } else if(smsCount ==2 && language == "English" && req.body.Body.toLowerCase() == "voter registration" ) {

//     message = "You have chosen the Voter Registration option.\n\nPlease visit the link below to register to vote: \nvote.gov" + 
//     "\n\nNeed in-person help? call us to register you to vote!\n+1(718)665-0400 ";
//     req.session.counter = smsCount + 1;

//     } else if (smsCount==2) {

//       message = " Please choose between Citizenship, Voter Registration, or Jobs";
//       sendMessage(message);
//       return;
// }

// if(smsCount==3) {
//   message = "got to the end of the dialog questions. Find me a way to bring me to the beginning!";
//   sendMessage(message);
//   return;
// }


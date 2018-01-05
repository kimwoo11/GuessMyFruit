/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
// or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.

// TODO add URL to this entry in the cookbook


 // 1. Text strings =====================================================================================================
 //    Modify these strings and messages to change the behavior of your Lambda function

 let speechOutput;
 let reprompt;
 const welcomeOutput = "I can guess the fruit you're thinking about, let me know when you're ready!";
 const welcomeReprompt = "Let me know if you have a fruit in mind!";
 const fruitAnswerIntro = [
   "hmm... let me guess, your fruit is...",
   "Ok, I think i've got it... your fruit is... ",
   "Oh, I like this fruit, it must be... "
 ];



 // 2. Skill Code =======================================================================================================

'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.879f09e1-2b86-4ab9-aa7f-abbb6f9eaabb"; 

const handlers = {
    'LaunchRequest': function () {
      this.response.speak(welcomeOutput).listen(welcomeReprompt);
      this.emit(':responseReady');
    },
    'AlexaGuessFruit': function () {
        //delegate to Alexa to collect all the required slot values
        //var filledSlots = delegateSlotCollection.call(this);

        //compose speechOutput that simply reads all the collected slot values
        var answerOutput = randomPhrase(fruitAnswerIntro);
        
        const intentObj = this.event.request.intent;
        var obj = this;
  
        var isBerry = getAttribute(intentObj, 'isBerry', obj);
        var fruitOutsideColour = getAttribute(intentObj, 'fruitOutsideColour', obj);
       
        if (isBerry == "yes" && fruitOutsideColour == "red"){
            answerOutput += "a strawberry.";
        } 
        else {
            answerOutput += "a fruit I don't know about yet!";
        }
        
        this.response.speak(answerOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = "";
        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}

function getAttribute(intentObj, slot,  obj) {
    // the argument is an applicable Intent 'slot' in the form of the string
    /*global AlexaGuessFruit*/
    if (!intentObj.slots[slot].value) {
        const slotToElicit = slot;
        const speechOutput = getAttributePrompt(slot);
        const repromptSpeech = speechOutput;
        obj.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
   } 
   
   return obj.event.request.intent.slots[slot].value
}

function getAttributePrompt(slot)
{
  switch(slot){
   case 'isBerry': return 'Is the fruit you are thinking about a berry?';
   case 'fruitOutsideColour': return 'What colour is the skin of the fruit?'
  }
}

function getFruitFact(fruit) {
	switch (fruit) {
	case "apple":
		return ["Did you know that apples are part of the rose family? Cool, right?",
			"Here is a fun fact about apple trees: they take four to five years to produce their first fruit.",
			"Here is an interesting fact: It takes the energy from 50 leaves to produce one apple.That’s a lot of energy!"];
	case "orange":
		return ["Did you know that Oranges contain more fiber than most fruits and vegetables? That’s very healthy!",
			"Here is a fun fact: the word “Orange” was first used to describe the colour and not the fruit.",
			"Here is an interesting fact: there are now over 600 varieties of oranges worldwide!"];
	case "strawberry":
		return ["Did you know there are there are 200 seeds on an average strawberry? Interesting, right?",
			"Here is a fun fact about strawberries: they are members of the rose family!",
			"Here is an interesting fact: There is a museum in Belgium just for strawberries. Sounds like fun!"]
	case "blackberry":
		return ["Did you know blackberries contain a lot of antioxidants which protect against inflammation, neurological diseases and aging? Interesting!",
			"Here is a fun fact about blackberries: they contain a lot of vitamins such as vitamin C, vitamin A, vitamin E, and vitamin K",
			"Here is an interesting fact: Blackberries are also known as thimbleberries, dewberries, and brambleberries."]
	case "blueberry":
		return ["Did you know that there are two types of blueberries: highbush and lowbush? I didn’t!",
			"Here is a fun fact: it only takes 4 minutes to freeze in the freezer!",
			"Here is an interesting fact: the white, powdery substance on blueberries is called “bloom.” Bloom indicates fresh berries"]
	case "banana":
		return ["Did you know that bananas are technically berries? Weird!",
			"Here is a fun fact: bananas float on water! I have to try this out!",
			"Interesting fact: about 75 percent of the weight of a banana is water."]
	}
}

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
 const welcomeOutput = "I can guess the fruit you're thinking about, " +
                       "Due to testing purposes, this skill only works with " +
                       "Watermelon, Orange, Banana, Strawberry, Blueberry, " +
                       "and Blackberry. let me know when you're ready!"
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
        var defaultAnswer = "Sorry, this a fruit I don't know about yet!";
  
        var isBerry = getAttribute(this, 'isBerry');
        var fruitOutsideColour = getAttribute(this, 'fruitOutsideColour');
       
        if (isBerry == "yes") {
            if (fruitOutsideColour == "red") {
                answerOutput += "a strawberry.";
            }
            else if (fruitOutsideColour == "blue") {
                answerOutput += "a blueberry.";
            }
            else if (fruitOutsideColour == "black") {
                answerOutput += "a blackberry.";
            }
            else {
                answerOutput = defaultAnswer;
            }
        } 
        else if (isBerry == "no") {
            if (fruitOutsideColour == "green") {
                answerOutput += "a watermelon.";
            }
            else if (fruitOutsideColour == "orange") {
                answerOutput += "an orange.";
            }
            else if (fruitOutsideColour == "yellow") {
                answerOutput += "a banana.";
            }
            else {
                answerOutput = defaultAnswer;
            }
        }
        else {
            answerOutput = defaultAnswer;
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

function getAttribute(obj, slot) {
    // the argument is an applicable Intent 'slot' in the form of the string
    var intentObj = obj.event.request.intent;
    const yesArray =[
         "yea",
         "yeah",
         "yep"
         "mhm"
         "absolutely"
         "of course"
         "indeed"
         "I think so"
         "probably"
         "certainly"
         "true"
    ];   
    const noArray =[
         "nah",
         "nope",
         "probably not"
         "no way"
         "absolutely not"
         "of course not"
         "naw"
         "false"     
    ]; 
 
    if (!intentObj.slots[slot].value) {
        const slotToElicit = slot;
        const speechOutput = getAttributePrompt(slot);
        const repromptSpeech = speechOutput;
        obj.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    
    if (yesArray.indexOf(obj.event.request.intent.slots[slot].value) != -1)
    {
        return "yes"
    }
    else if (noArray.indexOf(obj.event.request.intent.slots[slot].value) != -1)
    {
        return "no"
    }
 
   return obj.event.request.intent.slots[slot].value
}

function getAttributePrompt(slot)
{
  switch(slot){
   case "sizeTennisBall": return "Is your fruit smaller than, larger than, or around the same size as a tennis ball?";
   case "colourInside": return "What colour is your fruit on the inside?"
   case "colourOutside": return "What colour is your fruit on the outside?"
   case "numberSeeds": return "Does your fruit have one pit, multiple seeds, or none?"
   case "isLong": return "Is the shape of your fruit long?"
   case "isStinky": return "Is your fruit stinky?"
   case "isSkinRough": return "Is the skin of your fruit rough?"
   case "isCitrus": return "Is your fruit a citrus fruit?"
   case "isBellShape": return "Is your fruit bell-shaped?"
   case "isEdibleSkin": return "Do you typically eat the skin of your fruit?"
   case "isBerry": return "Is your fruit a berry?"
   case "isOneBiteSize": return "Can you eat your fruit in one bite?"
   case "seedsOutside": return "Does your fruit have visible seeds on the outside?"
  }
}

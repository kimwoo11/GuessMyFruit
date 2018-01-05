var jsonQuery = require("json-query");
var readlineSync = require("readline-sync");
var _ = require("underscore");

const fruitData = {
  "items" : [
    {
      "name" : "apple",
      "isBerry" : false,
      "exteriorColors" : ["red", "green", "yellow"]
    },
    {
      "name" : "orange",
      "isBerry" : false,
      "exteriorColors" : ["orange"]
    },
    {
      "name" : "banana",
      "isBerry" : false,
      "exteriorColors" : ["yellow"]
    },
    {
      "name" : "strawberry",
      "isBerry" : true,
      "exteriorColors" : ["red"]
    },
    {
      "name" : "blueberry",
      "isBerry" : true,
      "exteriorColors" : ["blue"]
    },
    {
      "name" : "blackberry",
      "isBerry" : true,
      "exteriorColors" : ["black"]
    }
  ],
  "attributes" : ["isBerry", "exteriorColors"]
};

function guessItem() {
  var gameData = _.clone(fruitData);

  while(gameData.items.length > 1 && gameData.attributes.length > 0) {
    var attributeTagMax = "";
    var attributeCntMax = 0;
    var op = "=";
    var index = 0;

    for(var a in gameData.attributes) {
      var attribute = gameData.attributes[a];
      var valueSet = new Set();

      for(var i in gameData.items) {
        var item = gameData.items[i];
        if(item[attribute] instanceof Array) {
          valueSet.add(item[attribute][0]);
        } else {
          valueSet.add(item[attribute]);
        }
      }

      if(valueSet.size > attributeCntMax) {
        attributeCntMax = valueSet.size;
        attributeTagMax = attribute;
        op = (gameData.items[0][attribute] instanceof Array) ? "~" : "=";
        index = a;
      }
    }

    var response = queryUser(attributeTagMax);

    var items = jsonQuery(`items[*${attributeTagMax}${op}${response}]`, {data : gameData}).value;

    gameData.items = items;
    gameData.attributes.splice(index, 1);

    console.log(gameData);
  }

  switch(gameData.items.length) {
    case 0: return "unknown";
    case 1: return gameData.items[0].name;
    default: return "multiple";
  }
}

function queryUser(attrib) {
  return readlineSync.question(`${attrib}? `);
}

guessItem();

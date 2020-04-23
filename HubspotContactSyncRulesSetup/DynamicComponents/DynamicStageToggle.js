
const _ = require('lodash');
let HubspotStageToggle = (trigger.args.request.query['HubspotStageToggle'] !== undefined) ? trigger.args.request.query['HubspotStageToggle'] : "false";
let CustomersToSync = (trigger.args.request.query['CustomersToSync'] !== undefined) ? trigger.args.request.query['CustomersToSync'] : "All_Customers";
let HubSpotContactNoMatch = (trigger.args.request.query['HubSpotContactNoMatch'] !== undefined) ? trigger.args.request.query['HubSpotContactNoMatch'] : "Create_contact";
let HubSpotContactMatch = (trigger.args.request.query['HubSpotContactMatch'] !== undefined) ? trigger.args.request.query['HubSpotContactMatch'] : "Update_empty_Hubspot_fields";
let NoSubscription = (trigger.args.request.query['NoSubscription'] !== undefined) ? trigger.args.request.query['NoSubscription'] : "select";
let TrialSubscription = (trigger.args.request.query['TrialSubscription'] !== undefined) ? trigger.args.request.query['TrialSubscription'] : "select";
let ActiveSubscription = (trigger.args.request.query['ActiveSubscription'] !== undefined) ? trigger.args.request.query['ActiveSubscription'] : "select";
let CanceledSubscription = (trigger.args.request.query['CanceledSubscription'] !== undefined) ? trigger.args.request.query['CanceledSubscription'] : "select";

let cloudElementsUrl = steps.EnvProps.cloudElementsUrl;
let card;

let instanceId = info.formulaInstanceId;

let allowedStageToggleKeys = [
  "select",
  "subscriber",
  "lead",
  "marketingqualifiedlead",
  "salesqualifiedlead",
  "opportunity",
  "customer",
  "evangelist",
  "other",
];

 let allowedStageToggleValues = [
    "Select",
    "Subscriber",
    "Lead",
    "Marketing Qualified lead",
    "Sales Qualified lead",
    "Opportunity",
    "Customer",
    "Evangelist",
    "Other",
];

let NoSubscriptionIndex = NoSubscription.toLowerCase() == 'select' ? -1 : allowedStageToggleKeys.indexOf(NoSubscription) ;
let TrialSubscriptionIndex = TrialSubscription.toLowerCase() == 'select' ? -1 : allowedStageToggleKeys.indexOf(TrialSubscription) ;
let ActiveSubscriptionIndex = ActiveSubscription.toLowerCase() == 'select' ? -1 : allowedStageToggleKeys.indexOf(ActiveSubscription) ;
let CancelledSubscriptionIndex = CanceledSubscription.toLowerCase() == 'select'? -1 : allowedStageToggleKeys.indexOf(CanceledSubscription) ;

let options = ['NoSubscription', 'TrialSubscription', 'ActiveSubscription', 'CancelledSubscription' ];

// To compute Index 
if(TrialSubscriptionIndex <= NoSubscriptionIndex){
    TrialSubscriptionIndex = -1;
    TrialSubscription = 'select'
}
  
if(ActiveSubscriptionIndex <= TrialSubscriptionIndex || ActiveSubscriptionIndex <= NoSubscriptionIndex){
    ActiveSubscriptionIndex = -1;
    ActiveSubscription = 'select' 
}
  
if(CancelledSubscriptionIndex <= TrialSubscriptionIndex || CancelledSubscriptionIndex <= ActiveSubscriptionIndex || CancelledSubscriptionIndex <= NoSubscriptionIndex){ 
    CancelledSubscriptionIndex = -1;
    CanceledSubscription = 'select';
}

arr = [ NoSubscriptionIndex, TrialSubscriptionIndex, ActiveSubscriptionIndex, CancelledSubscriptionIndex];



var getIndex =  (subscriptionStatus)=>{
    for(var i = options.indexOf(subscriptionStatus)-1; i < options.indexOf(subscriptionStatus) ;i--){
      if(arr[i] == -1){
          continue;
      } else{
          return arr[i] +1;
      }
  }
  return -1;
}

var GetToggleValues = (index)=>{
  var allowedValues = _.partition(allowedStageToggleValues,(i)=>allowedStageToggleValues.indexOf(i)<index)
  var map = _.reduce(allowedValues[1], (result, key)=>{result[key.toLowerCase().replace(/\s/g, '')] = key; return result;}, {select : 'Select'});
  return map;
}

TrialSubscriptionIndex = getIndex('TrialSubscription');

ActiveSubscriptionIndex = getIndex('ActiveSubscription');

CancelledSubscriptionIndex = getIndex('CancelledSubscription');

var NoSubscriptionStageToggleMap = _.reduce(allowedStageToggleValues, (result, key)=>{result[key.toLowerCase().replace(/\s/g, '')] = key; return result;}, {select : 'Select'});

var TrialSubscriptionStageToggleMap = GetToggleValues(TrialSubscriptionIndex)

var ActiveSubscriptionStageToggleMap = GetToggleValues(ActiveSubscriptionIndex)

var CancelledSubscriptionStageToggleMap = GetToggleValues(CancelledSubscriptionIndex)

let dynamicToggleRequest =  {
  type: "ON_CHANGE_FETCH_INPUT",
  apiEndPoint: {
    apiUrl: cloudElementsUrl+"/hubpspot/stagestoggle",
    type: "GET",
    headers: {
      "Elements-Formula-Instance-Id": instanceId,
    }
  },
};

let stages = [
  {
    dispName:
      "Choose the Lifecycle Stage in HubSpot you'd like to create/update the contact in, when the Chargebee customer",
    req: "false",
    type: "TEXTLABEL",
    id: "HubSpotContactMatch-id",
  },
  {
    dispName: '<p style="padding-left: 10px;">  Has no subscription',
    req: "false",
    type: "DROPDOWN",
    id: "NoSubscription",
    isMuted: "true",
    allowedValues: NoSubscriptionStageToggleMap,
    defaultVal: NoSubscription,
    isDynamic : "true",
    request : dynamicToggleRequest
  },
  {
    dispName: '<p style="padding-left: 10px;"> Has an In-Trial subscription',
    req: "false",
    type: "DROPDOWN",
    id: "TrialSubscription",
    isMuted: "true",
    allowedValues: TrialSubscriptionStageToggleMap,
    defaultVal: TrialSubscription,
    isDynamic : "true",
    request : dynamicToggleRequest
  },
  {
    dispName: '<p style="padding-left: 10px;"> Has an Active subscription',
    req: "false",
    type: "DROPDOWN",
    id: "ActiveSubscription",
    isMuted: "true",
    allowedValues: ActiveSubscriptionStageToggleMap,
    defaultVal: ActiveSubscription,
    isDynamic : "true",
    request : dynamicToggleRequest
  },
  {
    dispName: '<p style="padding-left: 10px;"> Has a Cancelled subscription',
    req: "false",
    type: "DROPDOWN",
    id: "CanceledSubscription",
    isMuted: "true",
    allowedValues: CancelledSubscriptionStageToggleMap,
    defaultVal: CanceledSubscription,
    isDynamic : "true",
    request : dynamicToggleRequest
  },
];

    card = {
        "cards": [
            {
                "card": {
                    "type": "DYNAMIC_INPUT",
                    "params": [
                        {
                            "dispName": "Choose customers you'd like to sync",
                            "req": "true",
                            "type": "DROPDOWN",
                            "id": "CustomersToSync",
                            "allowedValues": {
                                "All_Customers": "All Customers",
                                "Customers_with_Active_subscriptions": "Customers with Active subscriptions"
                            },
                            "defaultVal": CustomersToSync
                        },
                        {
                            "dispName": "Choose what happens when a customer in Chargebee does not have a matching contact in HubSpot",
                            "req": "true",
                            "type": "DROPDOWN",
                            "id": "HubSpotContactNoMatch",
                            "desc": "Chargebee will match customers with contacts in HubSpot using the Email ID field. When no matching contacts are found, you can choose to create a contact in HubSpot or do nothing",
                            "allowedValues": {
                                "Create_contact": "Create contact",
                                "Do_nothing": "Do nothing"
                            },
                            "defaultVal": HubSpotContactNoMatch
                        },
                        {
                            "dispName": "Choose what happens when a customer in Chargebee has a matching contact in HubSpot.<a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>",
                            "req": "true",
                            "type": "DROPDOWN",
                            "id": "HubSpotContactMatch",
                            "desc": "You can choose to update empty fields or override existing fields in HubSpot with customer details from Chargebee. ",
                            "allowedValues": {
                                "Update_empty_Hubspot_fields": "Update empty HubSpot fields",
                                "Override_the_fields": "Override the fields"
                            },
                            "defaultVal": HubSpotContactMatch
                        },
                        {       
                            "dispName":"Sync and Update Lifecycle stages in Hubspot",
                              "desc":"You can map subscription status of your Chargebee customers to the different lifecycle stages of a contact in Hubspot",
                              "type":"TOGGLE",
                              "id":"HubspotStageToggle",
                              "defaultVal": HubspotStageToggle,
                              "isDynamic":"true",
                              "request": dynamicToggleRequest
                        }
                              
                    ]
                },
                "id": "check1",
                "isCardDone": true
            }
        ]
    };

if(HubspotStageToggle == true || HubspotStageToggle == "true")
{
    let newParams = _.concat(card.cards[0].card.params, stages);
    card.cards[0].card.params = newParams
}

done({
    result: card
  });
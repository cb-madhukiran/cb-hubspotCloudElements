
const _ = require('lodash');

let HubspotStageToggle = (trigger.args.request.query['HubspotStageToggle'] !== undefined) ? trigger.args.request.query.HubspotStageToggle : "false";
let CustomersToSync = (trigger.args.request.query['CustomersToSync'] !== undefined) ? trigger.args.request.query['CustomersToSync'] : "All_Customers";
let HubSpotContactNoMatch = (trigger.args.request.query['HubSpotContactNoMatch'] !== undefined) ? trigger.args.request.query['HubSpotContactNoMatch'] : "Create_contact";
let HubSpotContactMatch = (trigger.args.request.query['HubSpotContactMatch'] !== undefined) ? trigger.args.request.query['HubSpotContactMatch'] : "Update_empty_Hubspot_fields";

let cloudElementsUrl = steps.EnvProps.cloudElementsUrl;
let card;

let instanceId = info.formulaInstanceId;

let dynamicToggleRequest =  {
  type: "ON_CHANGE_FETCH_INPUT",
  apiEndPoint: {
    apiUrl: cloudElementsUrl+"/hubspot/stagestoggle",
    type: "GET",
    headers: {
      "Elements-Formula-Instance-Id": instanceId,
    }
  },
};

let stages = steps.getLifeCycleStages.stages;

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

if(HubspotStageToggle === "true")
{
    let newParams = _.concat(card.cards[0].card.params, stages);
    card.cards[0].card.params = newParams;
}

done({
    result: card
  });
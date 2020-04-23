const _ = require('lodash');
let cloudElements = steps.getConfigApi.data.third_party_configuration.config_json.cloudElements;
let syncRulesContacts = cloudElements.syncRulesContacts;
let syncRulesDeals = cloudElements.syncRulesDeals;
let syncRuleForOrders = cloudElements.syncRuleForOrders;
let syncRulesFields = cloudElements.syncRulesFields;
let company;
let contact;
let deal;
let syncFields = "false";

let HubspotStageToggle = (syncRuleForOrders.HubspotStageToggle !== undefined) ? syncRuleForOrders.HubspotStageToggle : "true";
let NoSubscription = (syncRulesContacts.LifecycleStage.NoSubscription !== undefined) ? syncRulesContacts.LifecycleStage.NoSubscription : 'select'
let TrialSubscription = (syncRulesContacts.LifecycleStage.TrialSubscription !== undefined) ? syncRulesContacts.LifecycleStage.NoSubscription : 'select'
let ActiveSubscription = (syncRulesContacts.LifecycleStage.ActiveSubscription !== undefined) ? syncRulesContacts.LifecycleStage.NoSubscription : 'select'
let CanceledSubscription = (syncRulesContacts.LifecycleStage.CanceledSubscription !== undefined) ? syncRulesContacts.LifecycleStage.NoSubscription : 'select'

let MappedFieldChargebee = (syncRulesContacts.MappedFieldChargebee !== undefined) ? syncRulesContacts.MappedFieldChargebee: "email";

let MappedFieldHubspot = (syncRulesContacts.MappedFieldHubspot !== undefined) ? syncRulesContacts.MappedFieldHubspot : "email";

let cbcustomFields=steps.getCustomApi.data;
if(cbcustomFields!==undefined && cbcustomFields.response !== undefined) {
  cbcustomFields = JSON.parse(cbcustomFields.response);
}

if (syncRulesFields === undefined) {
  syncRulesFields = {

  };
}

if (syncRulesFields.company === undefined) {
  company = {};
} else {
  company = syncRulesFields.company;
}
if (syncRulesFields.deal === undefined) {
  deal = {};
} else {
  deal = syncRulesFields.deal;
}
if (syncRulesFields.contact === undefined) {
  contact = {};
} else {
  contact = syncRulesFields.contact;
}
if (syncRulesFields.sync !== undefined) {
  syncFields = syncRulesFields.sync;
}

let pipeLine = syncRulesDeals.pipeLine;
let stagesP =  steps.Stages.stage[pipeLine];
let customefields = [
  {
    label: "Subscription",
    key: "subcst",
    fields: [
      ['currency_code', 'string', 'text'],
      ['plan_unit_price', 'number', 'text', 'currency'],
      ['plan_amount', 'number', 'text', 'currency'],
      ['billing_period', 'number', 'text'],
      ['billing_period_unit', 'string', 'text'],
      ['plan_free_quantity', 'number', 'text'],
      ['start_date', 'datetime', 'date'],
      ['trial_start', 'datetime', 'date'],
      ['trial_end', 'datetime', 'date'],
      ['current_term_start', 'datetime', 'date'],
      ['current_term_end', 'datetime', 'date'],
      ['created_at', 'datetime', 'date'],
      ['started_at', 'datetime', 'date'],
      ['activated_at', 'datetime', 'date'],
      ['gift_id', 'string', 'text'],
      ['override_relationship', 'string', 'text'],
      ['pause_date', 'datetime', 'date'],
      ['resume_date', 'datetime', 'date'],
      ['cancelled_at', 'datetime', 'date'],
      ['cancel_reason', 'string', 'text'],
      ['affiliate_token', 'string', 'text'],
      ['created_from_ip', 'string', 'text'],
      ['resource_version', 'number', 'text'],
      ['updated_at', 'datetime', 'date'],
      ['has_scheduled_changes', 'string', 'text'],
      ['payment_source_id', 'string', 'text'],
      ['exchange_rate', 'number', 'text'],
      ['base_currency_code', 'string', 'text']
    ]
  },
  {
    label: "Customer",
    key: "custcst",
    fields: [
      ['vat_number', 'string', 'text'],
      ['vat_number_validated_time', 'datetime', 'date'],
      ['vat_number_status', 'string', 'text'],
      ['allow_direct_debit', 'string', 'text'],
      ['is_location_valid', 'string', 'text'],
      ['created_at', 'datetime', 'date'],
      ['created_from_ip', 'string', 'text'],
      ['taxability', 'string', 'text'],
      ['entity_code', 'string', 'text'],
      ['exempt_number', 'string', 'text'],
      ['resource_version', 'number', 'text'],
      ['updated_at', 'datetime', 'date'],
      ['locale', 'string', 'text'],
      ['consolidated_invoicing', 'string', 'text'],
      ['billing_date_mode', 'string', 'text'],
      ['billing_day_of_week', 'string', 'text'],
      ['billing_day_of_week_mode', 'string', 'text'],
      ['pii_cleared', 'string', 'text'],
      ['fraud_flag', 'string', 'text'],
      ['primary_payment_source_id', 'string', 'text'],
      ['backup_payment_source_id', 'string', 'text'],
      ['promotional_credits', 'number', 'text', 'currency'],
      ['unbilled_charges', 'number', 'text', 'currency'],
      ['refundable_credits', 'number', 'text', 'currency'],
      ['excess_payments', 'number', 'text', 'currency'],
      ['deleted', 'string', 'text'],
      ['registered_for_gst', 'string', 'text'],
      ['business_customer_without_vat_number', 'string', 'text'],
      ['customer_type', 'string', 'text'],
      ['client_profile_id', 'string', 'text'],
    ]
  },
  {
    label: "Order",
    key: "ordercst",
    fields: [
      ['document_number', 'string', 'text'],
      ['invoice_id', 'string', 'text'],
      ['cancellation_reason', 'string', 'text'],
      ['payment_status', 'string', 'text'],
      ['order_type', 'string', 'text'],
      ['price_type', 'string', 'text'],
      ['reference_id', 'string', 'text'],
      ['fulfillment_status', 'string', 'text'],
      ['shipping_date', 'datetime', 'date'],
      ['tracking_id', 'string', 'text'],
      ['batch_id', 'string', 'text'],
      ['created_by', 'string', 'text'],
      ['shipment_carrier', 'string', 'text'],
      ['invoice_round_off_amount', 'number', 'text', 'currency'],
      ['tax', 'number', 'text', 'currency'],
      ['amount_adjusted', 'number', 'text', 'currency'],
      ['refundable_credits_issued', 'number', 'text', 'currency'],
      ['refundable_credits', 'number', 'text', 'currency'],
      ['rounding_adjustement', 'number', 'text', 'currency'],
      ['paid_on', 'datetime', 'date'],
      ['shipping_cut_off_date', 'datetime', 'date'],
      ['created_at', 'datetime', 'date'],
      ['status_update_at', 'datetime', 'date'],
      ['delivered_at', 'datetime', 'date'],
      ['shipped_at', 'datetime', 'date'],
      ['resource_version', 'number', 'text'],
      ['updated_at', 'datetime', 'date'],
      ['cancelled_at', 'datetime', 'date'],
      ['discount', 'number', 'text', 'currency'],
      ['sub_total', 'number', 'text', 'currency'],
      ['total', 'number', 'text', 'currency'],
      ['deleted', 'string', 'text'],
      ['currency_code', 'string', 'text'],
      ['is_gifted', 'string', 'text'],
      ['gift_id', 'string', 'text']
    ]
  },
];

if(cbcustomFields !== undefined) {
  let cbsubKeys = Object.keys(cbcustomFields.customer_custom_fields);
  if(cbsubKeys.length >0) {
    for(var j=0;j<cbsubKeys.length;j++){
      customefields[1]["fields"].push([cbsubKeys[j],'string','text']);
    }
  }
  let cbsubKeys2 = Object.keys(cbcustomFields.subscription_custom_fields);
  if(cbsubKeys2.length >0) {
    for(var j=0;j<cbsubKeys2.length;j++){
      customefields[0]["fields"].push([cbsubKeys2[j],'string','text']);
    }
  }
}

let CustomFields_customer = cbcustomFields.customer_custom_fields;

let ChargebeeMappingValues = {
  "email": "Email",
  "phone": "Phone",
  "company": "Company",
};

ChargebeeMappingValues = Object.assign(ChargebeeMappingValues,CustomFields_customer);

let customCompanyFields = [
  {
    label: "Subscription",
    key: "subcst",
    fields: [
      ['plan_quantity', 'number', 'text'],
      ['plan_unit_price', 'number', 'text', 'currency'],
      ['plan_amount', 'number', 'text', 'currency'],
      ['plan_free_quantity', 'number', 'text']

    ]
  },
  {
    label: "Customer",
    key: "custcst",
    fields: [
      ['promotional_credits', 'number', 'text', 'currency'],
      ['unbilled_charges', 'number', 'text', 'currency'],
      ['refundable_credits', 'number', 'text', 'currency'],
      ['excess_payments', 'number', 'text', 'currency'],
    ]
  },
  {
    label: "Order",
    key: "ordercst",
    fields: [
      ['invoice_round_off_amount', 'number', 'text', 'currency'],
      ['tax', 'number', 'text', 'currency'],
      ['amount_adjusted', 'number', 'text', 'currency'],
      ['refundable_credits_issued', 'number', 'text', 'currency'],
      ['refundable_credits', 'number', 'text', 'currency'],
      ['rounding_adjustement', 'number', 'text', 'currency'],
      ['discount', 'number', 'text', 'currency'],
      ['sub_total', 'number', 'text', 'currency'],
      ['total', 'number', 'text', 'currency']
    ]
  },
];

let dOption = {
  "dispName": "When a subscription is <b>created</b> in Chargebee",
  "type": "DROPDOWN_DYNAMIC",
  "id": "SubCreatedOption",
  "isDynamic": "true",
  "request": {
    "type": "ON_CHANGE_FETCH_INPUT",
    "apiEndPoint": {
      "apiUrl": steps.getFormulaDetails.dealoptions.url,
      "type": "GET",
      "headers": {
        "Elements-Formula-Instance-Id": steps.getFormulaDetails.dealoptions.id
      },
      "input": {
        "type": steps.ManageSyncInputParams.config.inputJson.type
      }
    }
  },
  "dropDownItemsList": [
    {
      "value": "Create_A_Deal",
      "disp": "Create a deal"
    },
    {
      "value": "UpdateExistingDeal",
      "disp": "Update existing deal",
      "helptext": "The last Created Open deal will be updated in HubSpot. <a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn More</a>"
    },
    {
      "value": "DoNothing",
      "disp": "Do Nothing"
    }
  ]

};
dOption.defaultVal = syncRulesDeals.SubCreatedOption;

let Create_A_Deal = {
  "type": "DYNAMIC_INPUT",
  "params": [
    dOption,
    {
    "dispName": "Which Hubspot pipeline would you like to create this deal in?",
    "req": "true",
    "type": "DROPDOWN_DYNAMIC",
    "id": "pipeLine",
    "isDynamic": "true",
    "request": {
    "type": "ON_CHANGE_FETCH_INPUT",
    "apiEndPoint": {
      "apiUrl": steps.getFormulaDetails.dealoptions.url,
      "type": "GET",
      "headers": {
        "Elements-Formula-Instance-Id": steps.getFormulaDetails.dealoptions.id
      },
      "input": {
        "type": steps.ManageSyncInputParams.config.inputJson.type
      }
    }
  },
    "dropDownItemsList": steps.Stages.pipeline,
    "defaultVal": pipeLine

  },
    {
      "dispName": "Choose the deal stage in HubSpot you'd like to create this deal in",
      "type": "DROPDOWN",
      "id": "stage_subCreated",
      "allowedValues": stagesP,
      "defaultVal": syncRulesDeals.stage_subCreated
    },
    {
      "dispName": "Create new deals in Hubspot for subscriptions that are in trial",
      "req": "false",
      "type": "TOGGLE",
      "id": "createDealInTrial",
      "defaultVal": syncRulesDeals.allowCreateDealInTrial,
      "isDynamic": "true",
      "request": {
        "apiEndPoint": {
          "apiUrl": steps.getFormulaDetails.dealoptions.url,
          "headers": {
            "Elements-Formula-Instance-Id": steps.getFormulaDetails.dealoptions.id
          },
          "input": {
            "type": steps.ManageSyncInputParams.config.inputJson.type,
            "from": "toggle"
          },
          "type": "GET"
        },
        "type": "ON_CHANGE_FETCH_INPUT"
      }

    },
  ]
};

if (syncRulesDeals.allowCreateDealInTrial === "true") {
  Create_A_Deal.params.push(
    {
      "dispName": "Choose the deal stage you'd like to assign all In-Trial subscriptions to",
      "desc": "If disabled, all in-Trial subscriptions will automatically be assigned to the deal stage 'Closed-Won',as configured above.",
      "req": "false",
      "type": "DROPDOWN",
      "id": "stage_subInTrial",
      "allowedValues": stagesP,
      "defaultVal": syncRulesDeals.stage_subInTrial
    }
  );
}


let UpdateExistingDeal = {

  "type": "DYNAMIC_INPUT",
  "params": [
    dOption,
    {
    "dispName": "Which Hubspot pipeline would you like to create this deal in?",
    "req": "true",
    "type": "DROPDOWN_DYNAMIC",
    "id": "pipeLine",
    "isDynamic": "true",
    "request": {
    "type": "ON_CHANGE_FETCH_INPUT",
    "apiEndPoint": {
      "apiUrl": steps.getFormulaDetails.dealoptions.url,
      "type": "GET",
      "headers": {
        "Elements-Formula-Instance-Id": steps.getFormulaDetails.dealoptions.id
      },
      "input": {
        "type": steps.ManageSyncInputParams.config.inputJson.type
      }
    }
  },
    "dropDownItemsList": steps.Stages.pipeline,
    "defaultVal": pipeLine

  },
    {
      "dispName": "If there are no 'Open Deals' for the contact, allow Chargebee to look for open deals against the company",
      "req": "false",
      "type": "TOGGLE",
      "id": "allowNoOpenDeal",
      "defaultVal": syncRulesDeals.allowNoOpenDeal
    },
    {
      "dispName": "If there are no 'Open Deals' in HubSpot",
      "desc": "Choose what you'd like to do when there are no 'Open Deals' against a contact/comapny in HubSpot.",
      "type": "DROPDOWN",
      "id": "noOpenDeal",
      "allowedValues": {
        "Create_A_Deal": "Create a deal",
        "UpdateExistingDeal": "Update a deal",
        "DoNothing": "Do Nothing"
      },
      "defaultVal": syncRulesDeals.noOpenDeal

    },
    {
      "dispName": "Create new deals in Hubspot for subscriptions that are in trial",
      "req": "false",
      "type": "TOGGLE",
      "id": "createDealInTrial",
      "defaultVal": syncRulesDeals.allowCreateDealInTrial,
      "isDynamic": "true",
      "request": {
        "apiEndPoint": {
          "apiUrl": steps.getFormulaDetails.dealoptions.url,
          "headers": {
            "Elements-Formula-Instance-Id": steps.getFormulaDetails.dealoptions.id
          },
          "input": {
            "type": steps.ManageSyncInputParams.config.inputJson.type,
            "from": "toggle"
          },
          "type": "GET"
        },
        "type": "ON_CHANGE_FETCH_INPUT"
      }

    }

  ]
};

if (syncRulesDeals.allowCreateDealInTrial === "true") {
  UpdateExistingDeal.params.push(
    {
      "dispName": "Choose the deal stage you'd like to assign all In-Trial subscriptions to",
      "desc": "If disabled, all in-Trial subscriptions will automatically be assigned to the deal stage 'Closed-Won',as configured above.",
      "req": "false",
      "type": "DROPDOWN",
      "id": "stage_subInTrial",
      "allowedValues": stagesP,
      "defaultVal": syncRulesDeals.stage_subInTrial
    }
  );
}

let DoNothing = {
  "type": "DYNAMIC_INPUT",
  "params": [
    dOption
  ]
};
  
let dynamicToggleRequest =  {
    type: "ON_CHANGE_FETCH_INPUT",
    apiEndPoint: {
      apiUrl: steps.getFormulaDetails.dynamicToggle.url,
      type: "GET",
      headers: {
        "Elements-Formula-Instance-Id": steps.getFormulaDetails.dynamicToggle.id,
      }
    },
  };
  
let stages = steps.getLifeCycleStages.stages;

let card = {
  cards: [
    {
      "card": {
        "type": "EMPTY_BACKGROUND",
        "heading": "Sync Rules for Contacts",
        "contents": [
          "Configure how customer data is synced from Chargebee to HubSpot. Set rules to manage 'Contacts' in HubSpot from Chargebee. <a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>"
        ]

      },
      "isCardDone": "true",
      "id": "check11"
    },
    {
      "card": {
        "type": "DYNAMIC_INPUT",
        "params": [
          {
            "dispName": "Choose customers you'd like to sync",
            "type": "DROPDOWN",
            "id": "CustomersToSync",
            "allowedValues": {
              "All_Customers": "All Customers",
              "Customers_with_Active_subscriptions": "Customers with Active subscriptions"
            },
            "defaultVal": syncRulesContacts.CustomersToSync
          },
          {
            "dispName": "Choose what happens when a customer in Chargebee does not have a matching contact in HubSpot",
            "type": "DROPDOWN",
            "id": "HubSpotContactNoMatch",
            "desc": "Chargebee will match customers with contacts in HubSpot using the Email ID field. When no matching contacts are found, you can choose to create a contact in HubSpot or do nothing",
            "allowedValues": {
              "Create_contact": "Create contact",
              "Do_nothing": "Do nothing"
            },
            "defaultVal": syncRulesContacts.HubSpotContactNoMatch
          },
          {
            "dispName": "Choose what happens when a customer in Chargebee has a matching contact in HubSpot. <a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>",
            "type": "DROPDOWN",
            "id": "HubSpotContactMatch",
            "desc": "You can choose to update empty fields or override existing fields in HubSpot with customer details from Chargebee. ",
            "allowedValues": {
              "Update_empty_Hubspot_fields": "Update empty HubSpot fields",
              "Override_the_fields": "Override the fields"
            },
            "defaultVal": syncRulesContacts.HubSpotContactMatch
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
      "isCardDone": "true"
    },
    {
            "card": {
              "type" : "MAPPING",
              "heading": "Map Customers from Chargebee to Hubspot",
              "contents": "<b> Choose a unique field to map Chargebee customers to Hubspot contacts </b>",
              "leftComponent":{
                "id": "MappedFieldChargebee",
                "title": "Chargebee Fields",
                "allowedValues": ChargebeeMappingValues,
                "defaultValue": MappedFieldChargebee,
              },
              "rightComponent":{
                "id": "MappedFieldHubspot",
                "title": "Hubspot Fields",
                "allowedValues":{
                  "email": "Email",
                  "phone": "Phone",
                  "mobilephone": "Mobile Phone Number",
                  "company": "Company",
                  "work_email": "Work Email",
                  "twitterhandle": "Twitter Username"
                },
                "defaultValue": MappedFieldHubspot
              }
            },
             "id" : "check3",
             "isCardDone":"true"
    },
    {
      "card": {
        "type": "EMPTY_BACKGROUND",
        "heading": "Sync Rules for Deals",
        "contents": [
          "Configure how you'd like to handle deals in HubSpot when subscription are created in Chargebee. <a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>"
        ],
        "label": {
          "dispName": "All deals will be created or updated in the HubSpot Sales Pipeline",
          "type": "TEXTLABEL",
          "id": "label1",
          "icon": "INFO",
          "textColour": "INFO"
        }

      },
      "isCardDone": "true",
      "id": "check12"
    },
    {
      "card": syncRulesDeals.SubCreatedOption === "Create_A_Deal" ? Create_A_Deal : (syncRulesDeals.SubCreatedOption === "UpdateExistingDeal" ? UpdateExistingDeal : DoNothing),
      "id": "testdynamic",
      "isCardDone": "true"

    }
    ,
    {
      "card": {
        "type": "EMPTY_BACKGROUND",
        "heading": "Sync Rules for Fields",
        "contents": [
          "Set rules to sync fields from Chargebee to Hubspot . <a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>"
        ]

      },
      "isCardDone": "true",
      "id": "check14"
    }

  ],
  "save": {
    "id": "save",
    "display": "Save",
    "icon": "ARROW",
    "buttonLook": "FILLED",
    "type": "DIRECT_LINK",
    "request": {
      "type": "ON_CLICK_SEND_INPUT",
      "apiEndPoint": {
        "apiUrl": steps.getFormulaDetails.saveconfig.url,
        "type": "GET",
        "headers": {
          "Elements-Formula-Instance-Id": steps.getFormulaDetails.saveconfig.id
        },
        "input": {
          "id": "chargebee"

        }
      }
    }
  },
  "dismissText": "Dismiss"
};

if(HubspotStageToggle === "true")
{
    let newParams = _.concat(card.cards[1].card.params, stages);
    card.cards[1].card.params = newParams
}

let feildsCard = {
  "card": {
    "message": {
      "message": "If you need to sync additional fields from Chargebee to HubSpot, you may enable this option",
      "icon": "INFO",
      "messageLook": "INFO",
      "button": {
        "display": "View Fields",
        "icon": "ARROW",
        "url": "https://www.chargebee.com/docs/hubspot.html",
        "id": "viewFields",
        "type": "DIRECT_LINK",
        "newTab": "true"
      }
    },
    "type": "TOGGLE_HIDE_INPUT",
    "params": [
      {
        "dispName": "Sync additional fields from Chargebee to HubSpot",
        "type": "TOGGLE",
        "id": "syncMoreFields",
        "defaultVal": syncFields
      }
    ]
  },
  "id": "check4",
  "isCardDone": "true"
};
let dealFields = {
  "dispName": "Deal",
  "type": "MODELBOX_INPUT_FIELDS",
  "helptext": "Choose the fields you'd like to sync",
  "id": "deal",
  "inputFields": [
      {
          "type": "SEARCH_CHECK_BOX",
          "id": "dealFields",
          "checkboxes": [      
          ]
      }
  ]
};

let contactFields = {
  "dispName": "Contact",
  "type": "MODELBOX_INPUT_FIELDS",
  "id": "contact",
  "inputFields": [
      {
          "type": "SEARCH_CHECK_BOX",
          "id": "contactFields",
          "checkboxes": [      
          ]
      }
  ]
};
let companyFields = {
  "dispName": "Company",
  "type": "MODELBOX_INPUT_FIELDS",
  "id": "company",
  "inputFields": [
      {
          "type": "SEARCH_CHECK_BOX",
          "id": "companyFields",
          "checkboxes": [      
          ]
      }
  ]
};
for(var i=0;i<customefields.length;i++){
  let fld = customefields[i];

  for(var j=0;j<fld.fields.length;j++){
      var es = fld.fields[j];
      var desc =  fld.label + " " + es[0].replace(/_/g, " ");
      var id = fld.key+"_"+es[0];   
      
      if(fld.key === "subcst"){
        let dealObj = {
          "type": "CHECKBOX",
          "id": id,
          "desc": desc,
      };
      if(deal[id] !== undefined) {
        dealObj.defaultVal = "on";
      }
      
      dealFields.inputFields[0].checkboxes.push(dealObj);
      }
      
      
      let contactObj = {
          "type": "CHECKBOX",
          "id": id,
          "desc": desc,
      };
      if(contact[id] !== undefined) {
        contactObj.defaultVal = "on";
      }
      contactFields.inputFields[0].checkboxes.push(contactObj);

  }
}
for(var i=0;i<customCompanyFields.length;i++){
  let fld = customCompanyFields[i];

  for(var j=0;j<fld.fields.length;j++){
      var es = fld.fields[j];
      var desc =  fld.label + " " + es[0].replace(/_/g, " ");
      var id = fld.key+"_"+es[0];    
      let companyObj = {
          "type": "CHECKBOX",
          "id": id,
          "desc": desc
      };
      if(company[id] !== undefined) {
        companyObj.defaultVal = "on";
      }
      companyFields.inputFields[0].checkboxes.push(companyObj);     

  }
}
feildsCard.card.params.push(dealFields);
feildsCard.card.params.push(contactFields);
feildsCard.card.params.push(companyFields);
card.cards.push(feildsCard);
if (steps.GetCBOrder.response.code === 200 && steps.GetCBOrder.response.body.order_used === true) {
  card.cards.push({
    "card": {
      "type": "EMPTY_BACKGROUND",
      "heading": "Sync Rules for Orders",
      "contents": [
        "Set rules to sync orders from Chargebee to Hubspot. <a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>"
      ]

    },
    "isCardDone": "true",
    "id": "check15"
  });
  card.cards.push({
    "card": {
      "message": {
        "message": "Chargebee will sync your orders and related details like last order date, next order date and so on",
        "icon": "INFO",
        "messageLook": "INFO",
        "button": {
          "display": "Learn more",
          "icon": "ARROW",
          //"url": "https://www.chargebee.com/docs/index.html",
          "url":"https://www.chargebee.com/docs/hubspot.html",
          "id": "enableOrders",
          "type": "DIRECT_LINK",
          "newTab": "true"
        }
      },
      "type": "TOGGLE_HIDE_INPUT",
      "params": [
        {
          "dispName": "Allow Chargebee to sync orders to HubSpot",
          "type": "TOGGLE",
          "id": "syncOrders",
          "defaultVal": syncRuleForOrders.sync

        }
      ],

    },
    "id": "check16",
    "isCardDone": "true"
  });

}
done(card);
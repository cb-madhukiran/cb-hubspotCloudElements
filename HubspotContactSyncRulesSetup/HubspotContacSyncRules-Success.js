const _ = require('lodash');
let siteDomain = steps.setupCBConfig.siteDomain;
let integrationName = steps.setupCBConfig.type;
let syncRulesContacts =
  steps.getChargebeeConfigs.data.third_party_configuration.config_json
    .cloudElements.syncRulesContacts;

let CustomersToSync = "All_Customers";
let HubSpotContactNoMatch = "Create_contact";
let HubSpotContactMatch = "Update_empty_Hubspot_fields";
let HubspotStageToggle = "false";
let MappedFieldChargebee = "email";
let MappedFieldHubspot = "email";

if (syncRulesContacts !== undefined) {
  CustomersToSync = syncRulesContacts.CustomersToSync;
  HubSpotContactNoMatch = syncRulesContacts.HubSpotContactNoMatch;
  HubSpotContactMatch = syncRulesContacts.HubSpotContactMatch;
  HubspotStageToggle = syncRulesContacts.HubspotStageToggle;
  MappedFieldChargebee =
    syncRulesContacts.MappedFieldChargebee !== undefined
      ? syncRulesContacts.MappedFieldChargebee
      : "email";
  MappedFieldHubspot =
    syncRulesContacts.MappedFieldHubspot !== undefined
      ? syncRulesContacts.MappedFieldHubspot
      : "email";
}

let CustomFields =
  JSON.parse(steps.ChargebeeGetCustomFields.data.response) || null;

let CustomFields_customer = null;
if (CustomFields !== null) {
  CustomFields_customer = CustomFields.customer_custom_fields;
}

let ChargebeeMappingValues = {
  email: "Email",
  phone: "Phone",
  company: "Company",
};

ChargebeeMappingValues = Object.assign(
  ChargebeeMappingValues,
  CustomFields_customer
);


let card;

let dynamicRequest =  {
  type: "ON_CHANGE_FETCH_INPUT",
  apiEndPoint: {
    apiUrl: steps.Props.dynamicToggle.url,
    type: "GET",
    headers: {
      "Elements-Formula-Instance-Id": steps.Props.dynamicToggle.id,
    },
    input: {
      id: "chargebee",
      siteDomain: siteDomain,
      integrationName: integrationName,
    },
  },
};

let stages =  steps.getLifeCycleStages.stages;

card = {
  cards: [
    {
      card: {
        type: "EMPTY_BACKGROUND",
        heading: "Sync Rules for Contacts",
        contents: [
          "Configure how customer data is synced from Chargebee to HubSpot. Set rules to manage 'Contacts' in HubSpot from Chargebee. <a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>",
        ],
      },
      isCardDone: true,
      id: "check2",
    },
    {
      card: {
        type: "DYNAMIC_INPUT",
        params: [
          {
            dispName: "Choose customers you'd like to sync",
            req: "true",
            type: "DROPDOWN",
            id: "CustomersToSync",
            allowedValues: {
              All_Customers: "All Customers",
              Customers_with_Active_subscriptions:
                "Customers with Active subscriptions",
            },
            defaultVal: CustomersToSync,
          },
          {
            dispName:
              "Choose what happens when a customer in Chargebee does not have a matching contact in HubSpot",
            req: "true",
            type: "DROPDOWN",
            id: "HubSpotContactNoMatch",
            desc:
              "Chargebee will match customers with contacts in HubSpot using the Email ID field. When no matching contacts are found, you can choose to create a contact in HubSpot or do nothing",
            allowedValues: {
              Create_contact: "Create contact",
              Do_nothing: "Do nothing",
            },
            defaultVal: HubSpotContactNoMatch,
          },
          {
            dispName:
              "Choose what happens when a customer in Chargebee has a matching contact in HubSpot.<a href='https://www.chargebee.com/docs/hubspot.html' target='blank'>Learn more</a>",
            req: "true",
            type: "DROPDOWN",
            id: "HubSpotContactMatch",
            desc:
              "You can choose to update empty fields or override existing fields in HubSpot with customer details from Chargebee. ",
            allowedValues: {
              Update_empty_Hubspot_fields: "Update empty HubSpot fields",
              Override_the_fields: "Override the fields",
            },
            defaultVal: HubSpotContactMatch,
          },
          {
            dispName: "Sync and Update Lifecycle stages in Hubspot",
            desc:
              "You can map subscription status of your Chargebee customers to the different lifecycle stages of a contact in Hubspot",
            type: "TOGGLE",
            id: "HubspotStageToggle",
            defaultVal: HubspotStageToggle,
            isDynamic: "true",
            request: dynamicRequest
          },
        ],
      },
      id: "check1",
      isCardDone: true,
    },
    {
      card: {
        type: "MAPPING",
        heading: "Map Customers from Chargebee to Hubspot",
        contents:
          "<b> Choose a unique field to identify and map customers from Chargebee to 'contacts' in Hubspot </b>",
        leftComponent: {
          id: "MappedFieldChargebee",
          title: "Chargebee Fields",
          allowedValues: ChargebeeMappingValues,
          defaultValue: MappedFieldChargebee,
        },
        rightComponent: {
          id: "MappedFieldHubspot",
          title: "Hubspot Fields",
          allowedValues: {
            email: "Email",
            phone: "Phone",
            mobilephone: "Mobile Phone Number",
            company: "Company",
            work_email: "Work Email",
            twitterhandle: "Twitter Username",
          },
          defaultValue: MappedFieldHubspot,
        },
      },
      id: "check3",
      isCardDone: "true",
    },
  ],
  proceed: {
    id: "proceed",
    display: "Proceed",
    icon: "ARROW",
    buttonLook: "FILLED",
    type: "DIRECT_LINK",
    request: {
      type: "ON_CLICK_SEND_INPUT",
      apiEndPoint: {
        apiUrl: steps.Props.saveconfig.url,
        type: "GET",
        headers: {
          "Elements-Formula-Instance-Id": steps.Props.saveconfig.id,
        },
        input: {
          id: "chargebee",
          siteDomain: siteDomain,
          integrationName: integrationName,
        },
      },
    },
  },
};

if(HubspotStageToggle === "true"){
    // stages.forEach((element)=>{element.isDisabled = true}) // if isDisabled is working swap it
    let newParams = _.concat(card.cards[1].card.params, stages);
    card.cards[1].card.params = newParams;
}

done(card);

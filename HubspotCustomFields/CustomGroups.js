let creates = [];
let deletes = [];

let prefix = "cb_";

if (steps.ChargebeeConfigParams.data.config_json.noneedprefix !== undefined && steps.ChargebeeConfigParams.data.config_json.noneedprefix === true) {
  prefix = "";
}



if (steps.LoopOverHubGroups.entry.custom) {

  let syncRulesFields = steps.ConfigData.configJson.config_json.cloudElements.syncRulesFields;
  if (syncRulesFields === undefined) {
    syncRulesFields = {
      "company": {

      },
      "contact": {

      },
      "deal": {
      },
      "sync": "false"
    };

  } else {
    if (syncRulesFields.company === undefined || syncRulesFields.company === "") {
      syncRulesFields.company = {};
    }
    if (syncRulesFields.contact === undefined || syncRulesFields.contact === "") {
      syncRulesFields.contact = {};
    }
    if (syncRulesFields.deal === undefined || syncRulesFields.deal === "") {
      syncRulesFields.deal = {};
    }
  }
  syncRulesFields = JSON.parse(JSON.stringify(syncRulesFields));
  let customefields = steps.HubUrl.config.customefields;
  let customCompanyFields = steps.HubUrl.config.customCompanyFields;
  let companyKeys = Object.keys(syncRulesFields.company);

  for (var i = 0; i < companyKeys.length; i++) {
    syncRulesFields.contact[companyKeys[i]] = syncRulesFields.company[companyKeys[i]];
  }


  if (steps.GetCustomHubSpotGroups.cb_code === 200) {
    let body = steps.GetCustomHubSpotGroups.data.properties;
    if (body.length > 0) {
      for (var i = 0; i < body.length; i++) {
        let pName = body[i].name;
        if (pName.startsWith("cb_")) {
          pName = pName.substring(3);
        }
        if (steps.LoopOverHubGroups.entry.type === "company") {
          if (syncRulesFields.company[pName] === undefined) {
            syncRulesFields.company[pName] = "delete";
          } else {
            syncRulesFields.company[pName] = "off";
          }
        }
        if (steps.LoopOverHubGroups.entry.type === "contacts") {
          if (syncRulesFields.contact[pName] === undefined) {
            syncRulesFields.contact[pName] = "delete";
          } else {
            syncRulesFields.contact[pName] = "off";
          }
        }
        if (steps.LoopOverHubGroups.entry.type === "deal") {
          if (syncRulesFields.deal[pName] === undefined) {
            syncRulesFields.deal[pName] = "delete";
          } else {
            syncRulesFields.deal[pName] = "off";
          }
        }
      }
    }

  } else {
    if (steps.LoopOverHubGroups.entry.type === "company") {
      creates.push({
        url: "https://api.hubapi.com/properties/v1/companies/groups",
        body: {
          "name": "chargebeecustomproperties",
          "displayName": "Chargebee Custom Properties"
        }
      });
    }
    if (steps.LoopOverHubGroups.entry.type === "contacts") {
      creates.push({
        url: "https://api.hubapi.com/properties/v1/contacts/groups",
        body: {
          "name": "chargebeecustomproperties",
          "displayName": "Chargebee Custom Properties"
        }
      });
    }
    if (steps.LoopOverHubGroups.entry.type === "deal") {
      creates.push({
        url: "https://api.hubapi.com/properties/v1/deals/groups",
        body: {
          "name": "chargebeecustomproperties",
          "displayName": "Chargebee Custom Properties"
        }
      });
    }
  }

  if (steps.LoopOverHubGroups.entry.type === "company") {
    for (var i = 0; i < customCompanyFields.length; i++) {
      let fld = customCompanyFields[i];

      for (var j = 0; j < fld.fields.length; j++) {
        var es = fld.fields[j];
        var desc = fld.label + " " + es[0].replace(/_/g, " ");
        var id = fld.key + "_" + es[0];
        if (syncRulesFields.company[id] === "on") {
          creates.push({
            url: "https://api.hubapi.com/properties/v1/companies/properties",
            body: {
              "name": prefix + id,
              "label": desc,
              "description": desc,
              "groupName": "chargebeecustomproperties",
              "type": es[1],
              "fieldType": es[2],
              "formField": true
            }
          });

        } else if (syncRulesFields.company[id] === "delete") {

          deletes.push("https://api.hubapi.com/properties/v1/companies/properties/named/" + prefix + id);
        }

      }
    }

  } else {
    for (var i = 0; i < customefields.length; i++) {
      let fld = customefields[i];

      for (var j = 0; j < fld.fields.length; j++) {
        var es = fld.fields[j];
        var desc = fld.label + " " + es[0].replace(/_/g, " ");
        var id = fld.key + "_" + es[0];
        if (steps.LoopOverHubGroups.entry.type === "contacts") {
          if (syncRulesFields.contact[id] === "on") {
            creates.push({
              url: "https://api.hubapi.com/properties/v1/contacts/properties",
              body: {
                "name": prefix + id,
                "label": desc,
                "description": desc,
                "groupName": "chargebeecustomproperties",
                "type": es[1],
                "fieldType": es[2],
                "formField": true
              }
            });

          } else if (syncRulesFields.contact[id] === "delete") {

            deletes.push("https://api.hubapi.com/properties/v1/contacts/properties/named/" + prefix + id);
          }
        } else {
          if (syncRulesFields.deal[id] === "on") {
            creates.push({
              url: "https://api.hubapi.com/properties/v1/deals/properties",
              body: {
                "name": prefix + id,
                "label": desc,
                "description": desc,
                "groupName": "chargebeecustomproperties",
                "type": es[1],
                "fieldType": es[2],
                "formField": true
              }
            });

          } else if (syncRulesFields.deal[id] === "delete") {

            deletes.push("https://api.hubapi.com/properties/v1/deals/properties/named/" + prefix + id);
          }
        }


      }
    }
  }
} else {
  let companyProperties = [
    {
      "name": prefix + "totalsubscriptionmrr",
      "label": "Total subscription MRR",
      "description": "Total subscription MRR",
      "groupName": "chargebeesubscriptionmetrics",
      "type": "number",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "totalnoofsubscription",
      "label": "Total # of subscriptions",
      "description": "Total # of subscriptions",
      "groupName": "chargebeesubscriptionmetrics",
      "type": "number",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "totaldues",
      "label": "Total dues",
      "description": "Total dues",
      "groupName": "chargebeesubscriptionmetrics",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "totalinvoiceamountpaid",
      "label": "Total invoice amount paid",
      "description": "Total invoice amount paid",
      "groupName": "chargebeesubscriptionmetrics",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }
    , {
      "name": prefix + "totaldueinvoicescount",
      "label": "Total due invoices count",
      "description": "Total due invoices count",
      "groupName": "chargebeesubscriptionmetrics",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }];

  let contactProperties = [
    {
      "name": "chargebeecustomerid",
      "label": "Chargebee customer ID",
      "description": "Chargebee customer ID",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "billingaddress",
      "label": "BillingAddress",
      "description": "Billing Address",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "billingcity",
      "label": "BillingCity",
      "description": "Billing City",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }
    , {
      "name": prefix + "billingstate",
      "label": "BillingState",
      "description": "Billing State",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "billingcountry",
      "label": "BillingCountry",
      "description": "Billing Country",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "billingzip",
      "label": "BillingZip",
      "description": "Billing Zip",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "autocollection",
      "label": "Autocollection",
      "description": "Autocollection",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "preferredcurrencycode",
      "label": "PreferredCurrencyCode",
      "description": "Preferred Currency Code",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "paymentmethodstatus",
      "label": "PaymentMethod Status",
      "description": "PaymentMethod Status",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "paymentmethodtype",
      "label": "PaymentMethod Type",
      "description": "PaymentMethod Type",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "nettermdays",
      "label": "Net Term Days",
      "description": "Net Term Days",
      "groupName": "chargebeecustomerinfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "taxexemptstatus",
      "label": "Tax exempt status",
      "description": "Tax exempt status",
      "groupName": "chargebeecustomerinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "subscriptionid",
      "label": "Subscription ID",
      "description": "Subscription ID",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, 
    {
      "name": prefix + "currencycode",
      "label": "Currency Code",
      "description": "Chargebee Currency Code",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },{
      "name": prefix + "subscriptiostatus",
      "label": "Subscription status",
      "description": "Subscription status",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "subscriptionmrr",
      "label": "Subscription MRR",
      "description": "Subscription MRR",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "customermrr",
      "label": "Total Customer MRR",
      "description": "Total Customer MRR",
      "groupName": "chargebeecustomerinfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "product",
      "label": "Product",
      "description": "Product",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "planquantity",
      "label": "Plan quantity",
      "description": "Plan quantity",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "setupfee",
      "label": "Setup Fee",
      "description": "Setup Fee",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "dueinvoicescount",
      "label": "Due invoices count",
      "description": "Due invoices count",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "invoiceamountpaid",
      "label": "Invoice amount paid",
      "description": "Invoices amount paid",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "remainingbillingcycles",
      "label": "Remaining billing cycles",
      "description": "Remaining billing cycles",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "ponumber",
      "label": "PO Number",
      "description": "PO Number",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "nextbillingat",
      "label": "Next Billing At",
      "description": "Next Billing At",
      "groupName": "chargebeesubscriptioninfo",
      "type": "datetime",
      "fieldType": "date",
      "formField": true
    }, {
      "name": prefix + "nextbillingamount",
      "label": "Next Billing Amount",
      "description": "Next Billing Amount",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "totaldues",
      "label": "TotalDues",
      "description": "Total Dues",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "duesince",
      "label": "Due Since",
      "description": "Due Since",
      "groupName": "chargebeesubscriptioninfo",
      "type": "datetime",
      "fieldType": "date",
      "formField": true
    }, {
      "name": prefix + "lastorderdate",
      "label": "Last Order Date",
      "description": "LastOrderDate",
      "groupName": "chargebeeorderinfo",
      "type": "datetime",
      "fieldType": "date",
      "formField": true
    }, {
      "name": prefix + "lastorder",
      "label": "Last Order",
      "description": "Last Order",
      "groupName": "chargebeeorderinfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "lastorderstatus",
      "label": "Last Order Status",
      "description": "Last Order Status",
      "groupName": "chargebeeorderinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "lastorderbasecomponentsku",
      "label": "Last order base component SKU",
      "description": "Last order base component SKU",
      "groupName": "chargebeeorderinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "nextorderdate",
      "label": "Next Order Date",
      "description": "Next Order Date",
      "groupName": "chargebeeorderinfo",
      "type": "datetime",
      "fieldType": "date",
      "formField": true
    }, {
      "name": prefix + "nextorder",
      "label": "Next Order",
      "description": "Next Order",
      "groupName": "chargebeeorderinfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "nextorderbasecomponentsku",
      "label": "Next order base component SKU",
      "description": "Next order base component SKU",
      "groupName": "chargebeeorderinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "nextorderstatus",
      "label": "Next Order Status",
      "description": "Next Order Status",
      "groupName": "chargebeeorderinfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }];
  let dealProperties = [
    {
      "name": "hubspotcontact",
      "label": "Hubspot contact",
      "description": "Hubspot contact",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "currencycode",
      "label": "Currency Code",
      "description": "Chargebee Currency Code",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "subscriptionid",
      "label": "Subscription ID",
      "description": "Subscription ID",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "subscriptionstatus",
      "label": "Subscription status",
      "description": "Subscription status",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }
    , {
      "name": prefix + "subscriptionmrr",
      "label": "Subscription MRR",
      "description": "Subscription MRR",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "product",
      "label": "Product",
      "description": "Product",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "planquantity",
      "label": "Plan quantity",
      "description": "Plan quantity",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "setupfee",
      "label": "Setup fee",
      "description": "Setup fee",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }
    , {
      "name": prefix + "dueinvoicescount",
      "label": "Due invoices count",
      "description": "Due invoices count",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    },
    {
      "name": prefix + "remainingbillingcycles",
      "label": "Remaining billing cycles",
      "description": "Remaining billing cycles",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }
    , {
      "name": prefix + "ponumber",
      "label": "PO number",
      "description": "PO number",
      "groupName": "chargebeesubscriptioninfo",
      "type": "string",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "totaldues",
      "label": "Total dues",
      "description": "Total dues",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }
    , {
      "name": prefix + "nextbillingat",
      "label": "Next billing at",
      "description": "Next billing at",
      "groupName": "chargebeesubscriptioninfo",
      "type": "datetime",
      "fieldType": "date",
      "formField": true
    }, {
      "name": prefix + "nextbillingamount",
      "label": "Next Billing Amount",
      "description": "Next Billing Amount",
      "groupName": "chargebeesubscriptioninfo",
      "type": "number",
      "fieldType": "text",
      "formField": true
    }, {
      "name": prefix + "duesince",
      "label": "Due Since",
      "description": "Due Since",
      "groupName": "chargebeesubscriptioninfo",
      "type": "datetime",
      "fieldType": "date",
      "formField": true
    }];

  if (steps.GetCustomHubSpotGroups.cb_code === 404) {
    if (steps.LoopOverHubGroups.entry.type === "company") {
      creates.push({
        url: "https://api.hubapi.com/properties/v1/companies/groups",
        body: {
          "name": "chargebeesubscriptionmetrics",
          "displayName": "Chargebee subscription metrics"
        }
      });

      for (var k = 0; k < companyProperties.length; k++) {
        creates.push({
          url: "https://api.hubapi.com/properties/v1/companies/properties",
          body: companyProperties[k]
        });
      }

    }
    if (steps.LoopOverHubGroups.entry.type === "contacts") {
      if (steps.LoopOverHubGroups.entry.group === "chargebeecustomerinfo") {
        creates.push({
          url: "https://api.hubapi.com/properties/v1/contacts/groups",
          body: {
            "name": "chargebeecustomerinfo",
            "displayName": "Chargebee customer info"
          }
        });
      }
      if (steps.LoopOverHubGroups.entry.group === "chargebeesubscriptioninfo") {
        creates.push({
          url: "https://api.hubapi.com/properties/v1/contacts/groups",
          body: {
            "name": "chargebeesubscriptioninfo",
            "displayName": "Chargebee subscription info"
          }
        });
      }
      if (steps.LoopOverHubGroups.entry.group === "chargebeeorderinfo") {
        creates.push({
          url: "https://api.hubapi.com/properties/v1/contacts/groups",
          body: {
            "name": "chargebeeorderinfo",
            "displayName": "Chargebee order info"
          }
        });
      }

      for (var k = 0; k < contactProperties.length; k++) {
        if (steps.LoopOverHubGroups.entry.group === contactProperties[k].groupName) {
          creates.push({
            url: "https://api.hubapi.com/properties/v1/contacts/properties",
            body: contactProperties[k]
          });
        }
      }

    }
    if (steps.LoopOverHubGroups.entry.type === "deal") {
      creates.push({
        url: "https://api.hubapi.com/properties/v1/deals/groups",
        body: {
          "name": "chargebeesubscriptioninfo",
          "displayName": "Chargebee subscription info"
        }
      });



      for (var k = 0; k < dealProperties.length; k++) {
        creates.push({
          url: "https://api.hubapi.com/properties/v1/deals/properties",
          body: dealProperties[k]
        });
      }



    }
  } else if (steps.GetCustomHubSpotGroups.cb_code === 200) {

    let pMap = {};
    let existingProps = steps.GetCustomHubSpotGroups.data.properties;
    for (var ij = 0; ij < existingProps.length; ij++) {
      pMap[existingProps[ij].name] = existingProps[ij].name;
    }
    if (steps.LoopOverHubGroups.entry.type === "company") {
      for (var k = 0; k < companyProperties.length; k++) {
        if (pMap[companyProperties[k].name] === undefined) {
          creates.push({
            url: "https://api.hubapi.com/properties/v1/companies/properties",
            body: companyProperties[k]
          });
        }

      }

    }
    if (steps.LoopOverHubGroups.entry.type === "contacts") {
      for (var k = 0; k < contactProperties.length; k++) {
        if (steps.LoopOverHubGroups.entry.group === contactProperties[k].groupName) {
          if (pMap[contactProperties[k].name] === undefined) {
            creates.push({
              url: "https://api.hubapi.com/properties/v1/contacts/properties",
              body: contactProperties[k]
            });
          }

        }
      }

    }
    if (steps.LoopOverHubGroups.entry.type === "deal") {

      for (var k = 0; k < dealProperties.length; k++) {
        if (pMap[dealProperties[k].name] === undefined) {
          creates.push({
            url: "https://api.hubapi.com/properties/v1/deals/properties",
            body: dealProperties[k]
          });
        }
      }
    }

  }
}

console.log(creates)
console.log(deletes)


done({
  creates: creates,
  deletes: deletes
});

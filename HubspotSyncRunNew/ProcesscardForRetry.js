    let deltaSync = true;

    if(steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.syncType === undefined) {
    deltaSync = false;
    } else  if(steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.syncType.syncType === "initialSync" && steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.syncType.status == "success" ) {
    deltaSync = false;
    }
    else if(steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.syncType.syncType === "firstFullSync" && steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.syncType.status == "failed") {
        deltaSync = false;
    }


    let card = {
        "icon": "/third_party/cn-xero.png",
    
        "syncErrors": [
        {
        "card": {
                "type" : "ACTION",
                "heading" : "No errors found",
                "icon" : "WARNING"
            },
        "id": "sync_errors",
        "isCardDone": "false"
        }
    ],
        "overview": [{
            "card": {
                "type" : "PROCESSING",
                "processingText": " Syncing all customers and their subscriptions. This can take a while depending on the number of records to sync. You may navigate away from this page and come back later.",
                "request" : {
                "type":"DOC_READY_GET_CARD",
                "apiEndPoint":{
                    "apiUrl": steps.Props.syncRun.url,
                            "type": "GET",
                            "headers": {
                                "Elements-Formula-Instance-Id": steps.Props.syncRun.id
                            },
                            "input":{
                                "type": steps.SyncRunNewInputParams.input.type,
                                "action": "run",
                            }
                            
                }
                }
            },
            "id":"overview",
        "isCardDone":"false"
            
        }],
        
        "unlink": {
        "buttonLook": "MUTTED",
        "display": "Unlink Integration",
        "id": "unlink",
        "popUp": {
            "advance": "true",
            "apiEndPoint": {
            "apiUrl": "https://staging.cloud-elements.com/elements/api-v2/unlink",
            "headers": {
                "Elements-Formula-Instance-Id": "437163"
            },
            "input": {
                "type": "hubspot"
            },
            "type": "GET"
            },
            "cancelButton": "Dismiss",
            "description": "On unlinking, all authentication and configurations specific to this integration will be removed from Chargebee. If you reconnect, you ll need to sync all your data with Hubspot",
            "inputFields": [
            {
                "desc": "Retain Hubspot Data",
                "id": "retainHubspot",
                "type": "CHECKBOX"
            },
            {
                dispName:
                  "Retain the custom properties synced from Chargebee in Hubspot",
                req: "false",
                type: "TEXTLABEL",
                id: "HubspotRetain",
            },
            ],
            "submitButton": "Confirm",
            "title": "Unlink Integration with Hubspot",
            "type": "INPUT"
        },
        "type": "POP_UP"
    }
    };

    if(deltaSync) {
    card.overview[0].card.processingText ="Syncing all customers and their subscriptions after the last run sync...";
    }
    done({
    statusCode: 200,
    result: card
    });

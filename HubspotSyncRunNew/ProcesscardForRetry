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
      "apiEndPoint": {
        "apiUrl": steps.Props.unlink.url,
        "headers": {
          "Elements-Formula-Instance-Id":  steps.Props.unlink.id
        },
        "input": {
          "type": "hubspot"
        },
        "type": "GET"
      },
      "cancelButton": "Dismiss",
      "description": "This will remove all the configuration details such as login authentication, configurations mapping etc. If you want to sync again, you will have to start the sync process from the beginning.",
      "submitButton": "Unlink",
      "title": "Do you really want to unlink the integration?",
      "type": "SIMPLE"
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

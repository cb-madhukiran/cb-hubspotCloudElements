let syncLog = steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.syncLog;
let syncData = steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.syncData;

let fileId = "";

if(steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.logs !== undefined){
 fileId  = steps.ChargebeeGetTpIntegConf.data.third_party_configuration.config_json.cloudElements.logs.fullSync.s3_FileId;
}
let successRecord = syncLog.sCount + syncLog.sdCount;
let failedRecords =  syncLog.eCount + syncLog.edCount;

let errlist = [];
let list = [];
if(steps.ChargebeeGetTpData !== undefined && steps.ChargebeeGetTpData.data !== undefined && steps.ChargebeeGetTpData.data.list !== undefined) {
  list = steps.ChargebeeGetTpData.data.list;
}

if(list === undefined) {
  list = [];
}
if(list.length ===0){
  failedRecords = 0;
}
for(var i=0;i<list.length;i++){
  let tp = list[i].third_party_entity_mapping;
  errlist.push(tp.error_message);
}

let tim = Number(syncData.lastSync);
if(syncData.lastSync === undefined || syncData.lastSync === null) {
  tim = Math.round((new Date().getTime()) / 1000);
}
let ft = Math.round((new Date().getTime())/1000);
tim = ft - tim;

var final_text = "0 minutes ago";

if(tim < 60) {
  final_text = "0 minutes ago";
  console.log("Inside if")
}else if (tim < 3600) {
  final_text = Math.round((tim-60)/60) + " minutes ago";
  console.log("Inside first else if")
  console.log(tim)
}else if (tim <(3600 *24)) {
  let tim2 = tim%3600;
  final_text = Math.round((tim)/3600)+" hour " + Math.round((tim2-60)/60) + " minutes ago";
  console.log("Inside second else if")
  console.log(tim)
  console.log(tim2)
}else {
  let tim2 = tim %(3600*24);
  let tim3 = tim2 % 3600;
  final_text = Math.round((tim)/(3600*24))+" day " + Math.round((tim2)/3600)+" hour " + Math.round((tim3-60)/60) + " minutes ago";
  console.log("Inside else")
  console.log(tim)
  console.log(tim2)
  console.log(tim3)
}




let card = {
    "icon": "/third_party/cn-xero.png",
    "unlink": {
        "id": "unlink",
        "display": "Unlink Integration",
        "buttonLook": "MUTTED",
        "type": "POP_UP",
        "popUp": {
            "type": "SIMPLE",
            "title": "Do you really want to unlink the integration?",
            "submitButton": "Unlink",
            "cancelButton": "Dismiss",
            "description": "This will remove all the configuration details such as login authentication, configurations mapping etc. If you want to sync again, you will have to start the sync process from the beginning.",
            "apiEndPoint": {
                "apiUrl": steps.Props.unlink.url,
                "type": "GET",
                "headers": {
                    "Elements-Formula-Instance-Id": steps.Props.unlink.id
                },
                "input": {
                    "type": "hubspot"
                }
            }
        }
    },
    "syncErrors": [{
        "card": {
          	 "id":"check3",
            "type": "ACTION",
            "heading":(failedRecords === 0 ? "No" : failedRecords)  + " errors found  ",
             "listContent":errlist,
        
          "buttons":[
         {      
          "display": "Download CSV",       
          "icon": "CLOUD_DOWNLOAD",         
          "id": "download",       
          "fileId": fileId,           
          "type": "DOWNLOAD_FILE"         
         },
          {
            "id":"confirmation",
            "display" : "IGNORE ALL",
            "buttonLook":"EMPTY",
            "icon" : "CLOSE",
            "type" : "POP_UP",
            "popUp":{
              "type":"SIMPLE",
              "title":"Are you sure you want to ignore the errors?",
              "submitButton":"Yes, go ahead",
              "cancelButton":"Dismiss",
              "usecase":"DANGER",
              "description":"Subscription data of this customer will not be synced with Hubspot",
              "apiEndPoint":{
                "apiUrl":steps.Props.syncRun.url,
                "headers": {
                  "Elements-Formula-Instance-Id": steps.Props.syncRun.id
                },
                 "input": {
                      "type": steps.SyncRunNewInputParams.input.type,
                      
                       "ignoreAll": "true"
                      },
                "type":"GET"
              }
            }
          }
        ]
        
        },
        "id" : "sync_errors",
      "isCardDone":"true"
    }],
    "overview": [{
        "card": {
            "type": "ACTION2",
            "heading": "Last sync done 0 Minutes ago ",
            "id": "check2",
            "subHeading": successRecord +" records were synced with HubSpot",
            "buttons" :[
              {
                "id":"sync",
                "display" : "Sync now",
                "icon" : "AUTO_RENEW",
                "type" : "DIRECT_LINK",
                "buttonLook":"EMPTY",
                "request":{
                  "type":"ON_CLICK_GET_CARD",
                  "apiEndPoint": {
                "apiUrl": steps.Props.syncRun.url,
                "type": "GET",
                "headers": {
                    "Elements-Formula-Instance-Id": steps.Props.syncRun.id
                },
                "input":{
                    "type": steps.SyncRunNewInputParams.input.type,
                    "action": "retry",
                    "syncType": "fullSync"
                }
            }
                  }
                }
              ],
        },
        "id" : "overview",
        "isCardDone":"true"
    }]
};


  card.overview[0].card.heading = "Last sync done "+ final_text;



  if(failedRecords > 0) {
    card.overview[0].card.message = {
                      "message":  failedRecords + " records could not be synced to HubSpot",
                      "button": {
                          "id": "errors",
                          "display": "See all errors",
                          "icon": "ARROW",
                          "type": "TAB_CHANGE",
                       
                        }
                    };
    card.overview[0].card.message.icon = "WARNING";
    card.overview[0].card.message.messageLook = "WARN";
  }
  
  if(failedRecords === 0){
  card.syncErrors =  [
    {
      "card": {
            "type" : "ACTION",
            "heading" : "No errors found",
            "icon" : "WARNING"
         },
      "id": "sync_errors",
      "isCardDone": "false"
    }
  ];
}

done({
  statusCode: 200,
  result: card
});

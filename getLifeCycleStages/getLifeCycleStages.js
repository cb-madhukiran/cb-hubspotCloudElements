const _ = require('lodash');

let getRequestArgs = (arg)=>{
    let triggerArgument = trigger.args[arg];
        if(triggerArgument !== undefined) 
            return triggerArgument;
        else{
            return "select";
        }
    }

let NoSubscription = getRequestArgs('NoSubscription');
let TrialSubscription = getRequestArgs('TrialSubscription');
let ActiveSubscription = getRequestArgs('ActiveSubscription');
let CanceledSubscription = getRequestArgs('CanceledSubscription');

let cloudElementsUrl = steps.EnvProps.cloudElementsUrl;

let instanceId = steps.EnvProps.id;

//Please ensure the keys order
let allowedStageDropDownKeys = [
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
 let allowedStageDropDownValues = {
  select: "Select",
  subscriber: "Subscriber",
  lead: "Lead",
  marketingqualifiedlead: "Marketing Qualified lead",
  salesqualifiedlead: "Sales Qualified lead",
  opportunity: "Opportunity",
  customer: "Customer",
  evangelist: "Evangelist",
  other: "Other"
}

let getIndexKey = (subscriptionStatus)=> {
    if(subscriptionStatus.toLowerCase() === 'select'){
        return -1;
    }
    else{
        return allowedStageDropDownKeys.indexOf(subscriptionStatus) ;
    }
}


let NoSubscriptionIndex = getIndexKey(NoSubscription);
let TrialSubscriptionIndex = getIndexKey(TrialSubscription);
let ActiveSubscriptionIndex = getIndexKey(ActiveSubscription);
let CancelledSubscriptionIndex = getIndexKey(CanceledSubscription);

let SubscriptionStatusOptions = ['NoSubscription', 'TrialSubscription', 'ActiveSubscription', 'CanceledSubscription' ];

let arr = [ NoSubscriptionIndex, TrialSubscriptionIndex, ActiveSubscriptionIndex, CancelledSubscriptionIndex];

//Logic to reset if any incorrect order
// Eg arr = [5, 4 , 4 , 3] => arr = [5, -1, -1, -1]
for(var i = arr.length-1 ; i > 0; i--){
    for(var j = i-1 ; j>=0; j-- ){
        if(arr[j] >= arr[i]){
            arr[i] = -1;
        }
    }
}


if(arr[SubscriptionStatusOptions.indexOf('TrialSubscription')] == -1){
    TrialSubscription = 'select';
}
  
if(arr[SubscriptionStatusOptions.indexOf('ActiveSubscription')] == -1){
    ActiveSubscription = 'select' ;
}
  
if(arr[SubscriptionStatusOptions.indexOf('CanceledSubscription')] == -1){ 
    CanceledSubscription = 'select';
}

//There are two steps to compute this index
// first we find the first available index from the array
// and compute the allowed values for corresponding drop down

var getIndex =  (subscriptionStatus)=>{
    for(var i = SubscriptionStatusOptions.indexOf(subscriptionStatus)-1; i>=0;i--){
      if(arr[i] == -1){
          continue;
      } else{
          return arr[i] +1;
      }
  }
  return -1;
}

var getDropDownValues = (index)=>{  
  let allValues = _.partition(allowedStageDropDownKeys,(i)=>allowedStageDropDownKeys.indexOf(i)<index);
  let allowedValues = allValues[1];

  let result = {select : 'Select'}

    allowedValues.forEach((element)=>{
      result[element]=allowedStageDropDownValues[element];
    })
    return result;
}


let NoSubscriptionStageDropDownMap = getDropDownValues(0) // can contain all values for No subscription

let TrialSubscriptionStageDropDownMap = getDropDownValues(getIndex('TrialSubscription'));  

let ActiveSubscriptionStageDropDownMap = getDropDownValues(getIndex('ActiveSubscription'));

let CancelledSubscriptionStageDropDownMap = getDropDownValues(getIndex('CanceledSubscription'));

let dynamicRequest =  {
  type: "ON_CHANGE_FETCH_INPUT",
  apiEndPoint: {
    apiUrl: cloudElementsUrl+"/hubspot/stagestoggle",
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
    allowedValues: NoSubscriptionStageDropDownMap,
    defaultVal: NoSubscription,
    isDynamic : "true",
    request : dynamicRequest
  },
  {
    dispName: '<p style="padding-left: 10px;"> Has an In-Trial subscription',
    req: "false",
    type: "DROPDOWN",
    id: "TrialSubscription",
    isMuted: "true",
    allowedValues: TrialSubscriptionStageDropDownMap,
    defaultVal: TrialSubscription,
    isDynamic : "true",
    request : dynamicRequest
  },
  {
    dispName: '<p style="padding-left: 10px;"> Has an Active subscription',
    req: "false",
    type: "DROPDOWN",
    id: "ActiveSubscription",
    isMuted: "true",
    allowedValues: ActiveSubscriptionStageDropDownMap,
    defaultVal: ActiveSubscription,
    isDynamic : "true",
    request : dynamicRequest
  },
  {
    dispName: '<p style="padding-left: 10px;"> Has a Cancelled subscription',
    req: "false",
    type: "DROPDOWN",
    id: "CanceledSubscription",
    isMuted: "true",
    allowedValues: CancelledSubscriptionStageDropDownMap,
    defaultVal: CanceledSubscription,
    isDynamic : "true",
    request : dynamicRequest
  },
];
done({stages:stages});
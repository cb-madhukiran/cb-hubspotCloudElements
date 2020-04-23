const _ = require('lodash');

let getRequetArgs = (arg)=>{
    let triggerArgument = trigger.args[arg];
        if(triggerArgument !== undefined) 
            return triggerArgument;
        else{
            return "select";
        }
    }

let NoSubscription = getRequetArgs('NoSubscription');
let TrialSubscription = getRequetArgs('TrialSubscription');
let ActiveSubscription = getRequetArgs('ActiveSubscription');
let CanceledSubscription = getRequetArgs('CanceledSubscription');

let cloudElementsUrl = steps.EnvProps.cloudElementsUrl;

let instanceId = info.formulaInstanceId;

//Please ensure the keys and values are corresponsing values
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
//Please ensure the keys and values are corresponsing values
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

let getIndexKey = (subscriptionStatus)=> {
    if(subscriptionStatus.toLowerCase() === 'select'){
        return -1;
    }
    else{
        return allowedStageToggleKeys.indexOf(subscriptionStatus) ;
    }
}


let NoSubscriptionIndex = getIndexKey(NoSubscription);
let TrialSubscriptionIndex = getIndexKey(TrialSubscription);
let ActiveSubscriptionIndex = getIndexKey(ActiveSubscription);
let CancelledSubscriptionIndex = getIndexKey(CanceledSubscription);

let SubscriptionStatusOptions = ['NoSubscription', 'TrialSubscription', 'ActiveSubscription', 'CanceledSubscription' ];

let arr = [ NoSubscriptionIndex, TrialSubscriptionIndex, ActiveSubscriptionIndex, CancelledSubscriptionIndex];

//Logic to reset if any incorrect order
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
// and compute the getToggleValues 

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

var GetToggleValues = (index)=>{  
  var allowedValues = _.partition(allowedStageToggleValues,(i)=>allowedStageToggleValues.indexOf(i)<index)
  var map = _.reduce(allowedValues[1], (result, value)=>{
      var key = allowedStageToggleKeys[allowedStageToggleValues.indexOf(value)]
      result[key] = value; 
      return result;
    }, {select : 'Select'});
  return map;
}


var NoSubscriptionStageToggleMap = GetToggleValues(0) // can contain all values for No subscription

var TrialSubscriptionStageToggleMap = GetToggleValues(getIndex('TrialSubscription'));  

var ActiveSubscriptionStageToggleMap = GetToggleValues(getIndex('ActiveSubscription'));

var CancelledSubscriptionStageToggleMap = GetToggleValues(getIndex('CanceledSubscription'));

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
done({stages:stages});
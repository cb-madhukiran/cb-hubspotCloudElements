//get the formula name and send the json with name :{url:"",id:""}
let cloud = "https://staging.cloud-elements.com";
let formulaName = trigger.args.formulaName;
let props  = {
   getDealRules: {
   url: cloud+"/elements/api-v2/hubspot/syncRulesDealsSetup"
  },
  saveDealRules: {
   url: cloud+"/elements/api-v2/hubspot/saveDealRules",
   id:"412129"
  },
  dealoptions:{
    url :cloud + "/elements/api-v2/hubspot/dealoptions",
    id:"412128"
  },
  gettoken:{
     url : cloud +"/elements/api-v2/hubspot/token",
     id: "412130",
  },
  //need to check with shamim
  refresh:{
    url: "/formulas/instances/405771/executions"
  },
  //need to confirm from old account
  save: {
   url: cloud+"/elements/api-v2/hubspot/save",
   id:"412153"
  },
   saveconfig: {
   url: cloud+"/elements/api-v2/hubspot/saveconfig",
   id:"412279"
  }
};
let resultJson = {"status":"error"};
if(formulaName !== undefined && formulaName !== "")
{
  resultJson = props[formulaName];
}
else
{
  resultJson = props;
}

//console.log(resultJson);
done(resultJson);


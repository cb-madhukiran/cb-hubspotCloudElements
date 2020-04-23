let apiKey = trigger.args.request.query['cb-api-key'];
let siteName = trigger.args.request.query['cb-site-name'];
let siteDomain = trigger.args.request.query['cb-domain'];
let integrationName = trigger.args.request.query.integrationName;
let password = "";
let HubspotStageToggle = trigger.args.request.query['HubspotStageToggle']

let CustomersToSync= trigger.args.request.query.CustomersToSync || "All_Customers";
let HubSpotContactNoMatch= trigger.args.request.query.HubSpotContactNoMatch || "Create_contact";
let HubSpotContactMatch= trigger.args.request.query.HubSpotContactMatch || "Update_empty_Hubspot_fields";

let NoSubscription;
let TrialSubscription;
let ActiveSubscription;
let CanceledSubscription;

if(HubspotStageToggle === "true"){
    NoSubscription= trigger.args.request.query.NoSubscription;
    TrialSubscription= trigger.args.request.query.TrialSubscription;
    ActiveSubscription= trigger.args.request.query.ActiveSubscription ;
    CanceledSubscription= trigger.args.request.query.CanceledSubscription;
}
else{
    NoSubscription = 'select',
    TrialSubscription = 'select',
    ActiveSubscription = 'select',
    CanceledSubscription = 'select'
}
let headers = {
      Authorization: "Basic " + CE.b64(apiKey + ":" + password)
    };
let params = {
  input :{
    apiKey:apiKey,
    siteName:siteName,
    siteDomain:siteDomain,
    integrationName:integrationName,
    cbheaders:headers
  },
  options: {
  CustomersToSync: CustomersToSync,
  MappedFieldChargebee: (trigger.args.request.query.MappedFieldChargebee !== undefined) ? trigger.args.request.query.MappedFieldChargebee : undefined,
  MappedFieldHubspot: (trigger.args.request.query.MappedFieldHubspot !== undefined) ? trigger.args.request.query.MappedFieldHubspot : undefined, 
  HubSpotContactNoMatch: HubSpotContactNoMatch,
  HubSpotContactMatch: HubSpotContactMatch,
  HubspotStageToggle: HubspotStageToggle,
  LifecycleStage :{
     NoSubscription: NoSubscription,
  TrialSubscription: TrialSubscription,
  ActiveSubscription:ActiveSubscription,
  CanceledSubscription:CanceledSubscription
  },
  }
 
};


let getTpConfigParams = {
    url: "https://"+siteName+"."+siteDomain+"/api/v2/third_party_configurations",
    headers:{
      Authorization: "Basic " + CE.b64(apiKey + ":" + password)
    },
    query:{
      integration_name: integrationName
    },
  apiKey: apiKey,
  siteName: siteName,
  siteDomain:siteDomain,
  type: integrationName,    
};


done({
  params: params,
  getTpConfigParams: getTpConfigParams
})



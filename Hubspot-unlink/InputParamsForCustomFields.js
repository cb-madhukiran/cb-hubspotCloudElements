let customId = steps.ConfigParams.configJSON.cloudElements.formulas.fullSync.custom

let retainHubspot = steps.InputParams.retainHubspot;

let url = "/formulas/instances/" + customId + "/executions";
console.log(url);
let apiKey = steps.InputParams.input.apiKey;
let siteName = steps.InputParams.input.siteName;
let type = steps.InputParams.input.type;
let domain = steps.InputParams.input.siteDomain;
let custom = {
    url: url,
    body: {
      "cb-api-key": apiKey,
      "cb-site-name": siteName,
      "type": type,
      "cb-domain": domain,
      "debugLoggingEnabled": true,
      "retainHubspot": retainHubspot
    }
  };
  done({custom:custom});

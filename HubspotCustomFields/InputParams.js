let apiKey = trigger.args['cb-api-key'];
let siteName = trigger.args['cb-site-name'];
let type = trigger.args.type;
let siteDomain = trigger.args['cb-domain'];


let password = "";
let headers = {
            Authorization: "Basic " + CE.b64(apiKey + ":" + password),
            api_key : apiKey
        };
let data = {
   input: {
        apiKey: apiKey,
        siteName: siteName,
        siteDomain: siteDomain,
        type: type,
        cbheaders:headers
    },
    cbconfig: {
        //url: "https://" + siteName + "." + siteDomain + "/api/v2/third_party_configurations",
        url: "https://" + siteName + ".integrations." + siteDomain + "/api/third_party_configurations/tpmeta",
        query: {
            "integration_name": type,
        },
        headers:headers,
        apiKey: apiKey,
        siteName: siteName,
        siteDomain: siteDomain,
        type: type,
    },
    cbfields:{
       url: "https://" + siteName + "." + siteDomain + "/api/v2/custom_field_configs",
        headers:headers,
        apiKey: apiKey,
        siteName: siteName,
        siteDomain: siteDomain,
        type: type,
    },
    config: {
        //url: "https://" + siteName + "." + siteDomain + "/api/v2/third_party_configurations",
        url: "https://" + siteName + ".integrations." + siteDomain + "/api/third_party_configurations/tpmeta",
        customFieldUrl: "https://" + siteName + "." + siteDomain + "/api/v2/custom_field_configs",
        auth: {
            Authorization: "Basic " + CE.b64(apiKey + ":" + password)
        },
        query: {
            integration_name: type
        }
    },
    update: {
        url: "https://" + siteName + ".integrations." + siteDomain + "/integrations/update_tp_integ_conf",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache"
        },
        body: {
            integration_name: type,
            site_name: siteName,
            api_key: apiKey
        }
    },
};
done(data);

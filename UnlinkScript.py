import requests
import json
headers = {
            "Authorization": <excluded intentionally>
            "Content-Type": "application/json",
          }

formulas = {
    "HubspotValidate" : 31469,
    "HubSpotFullSync":31443,
    "HubSpotFullSyncContacts_revamped":31720,
    "HubSpotFullSyncDeals-Revamped":31839,
    "HubSpotFullSyncMetrics":31672,
    "HubSpotCustomFields":31448
}
deleteUrl = "https://staging.cloud-elements.com/elements/api-v2/formulas/instances/"
    
for formula in formulas:
    instanceMaps = dict()
    url = "https://staging.cloud-elements.com/elements/api-v2/formulas/" + str(formulas[formula]) +"/instances"
    response = requests.get(url, headers=headers)

    body = json.loads(response.content)
    
    for r in body:   
        instanceName = r.get("name")  
        currInstanceId = r.get("id")
        if instanceName in instanceMaps:
            instanceMaps[instanceName] = max(instanceMaps[instanceName],currInstanceId)
        else:
            instanceMaps[instanceName] = currInstanceId
    print(formula)
    print("Retrive instaces of formula")
    
    print(instanceMaps)

    print("\n")
    
    for r in body:
        curId = r.get("id")
        if instanceMaps[instanceName] == curId:
            continue
        else:
            print("\t"+r.get("name"))
            print("\t"+deleteUrl+str(curId))
            # res = requests.delete(deleteUrl,headers = headers)
            # print(res)

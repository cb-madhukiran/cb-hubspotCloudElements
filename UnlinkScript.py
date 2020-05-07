import requests
import json
headers = {
            "Authorization": "<excluded intentionally>" , 
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
file1 = open("final3.txt", "a") 
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
    file1.write(formula+'\n')
    file1.write("Retrive instaces of formula \n" )
    file1.write(json.dumps(instanceMaps)+'\n')
    # print("\n")
    
    for r in body:
        curId = r.get("id")
        instanceName = r.get("name")  
        if instanceMaps[instanceName] == curId:
            file1.write("Skipping  "+str(instanceName)+" \n")
            file1.write("\t "+str(curId)+"\n")
            continue
        else:
            print("Delete\t"+r.get("name")+"\n")
            print("\t"+str(curId))
            file1.write("Delete\t"+r.get("name")+"\n")
            file1.write("\t"+str(curId)+"\n")
            res = requests.delete(deleteUrl+str(curId),headers = headers)
            file1.write(str(res.status_code)+" Successfully deleted \n")
            # print(res.status_code)

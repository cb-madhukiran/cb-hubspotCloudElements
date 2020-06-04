let cloudElements = steps.getConfigApi.data.third_party_configuration.config_json.cloudElements;
let syncRulesContacts = cloudElements.syncRulesContacts;
let NoSubscription;
let TrialSubscription;
let ActiveSubscription;
let CanceledSubscription;
if (syncRulesContacts !== undefined) {
    let LifecycleStage = syncRulesContacts.LifecycleStage;
    if (LifecycleStage !== undefined) {
        NoSubscription = LifecycleStage.NoSubscription;
        TrialSubscription = LifecycleStage.TrialSubscription;
        ActiveSubscription = LifecycleStage.ActiveSubscription;
        CanceledSubscription = LifecycleStage.CanceledSubscription;
    }
}

  if (NoSubscription === undefined) {
    NoSubscription = "select";
  }
  if (TrialSubscription === undefined) {
    TrialSubscription = "select";
  }
  if (ActiveSubscription === undefined) {
    ActiveSubscription = "select";
  }
  if (CanceledSubscription === undefined) {
    CanceledSubscription = "select";
  }

let params = {
    NoSubscription : NoSubscription,
    TrialSubscription : TrialSubscription,
    ActiveSubscription : ActiveSubscription,
    CanceledSubscription : CanceledSubscription
}
done({params : params})
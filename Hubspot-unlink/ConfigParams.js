let config_param = {
  configJSON :steps.ChargebeeConfigParams.response.body.third_party_configuration.config_json
};

config_param.deleteArray = [];
let formulas = config_param.configJSON.cloudElements;
if(formulas !== undefined) {
  formulas = formulas.formulas;
}

if(formulas !== undefined) {
  config_param.deleteArray.push({
    id:formulas.formula_FullSync.id,
    instance:formulas.formula_FullSync.instance
});

config_param.deleteArray.push({
    id:formulas.formula_InitialSync.id,
    instance:formulas.formula_InitialSync.instance
});

config_param.deleteArray.push({
    id:formulas.formula_Validate.id,
    instance:formulas.formula_Validate.instance
});
}


done(config_param);

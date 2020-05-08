/**
 * xlsFormValidation()
 *
 * Fetch list of odk choices for a form
 *
 * -----------------------------------------------------------------
 * @param {Ref} formName
 * -----------------------------------------------------------------
 * @returns {json}
 *
 */

parasails.registerUtility('xlsFormValidation', function xlsFormValidation(formName) {

  /* XLSFORM REQUIRED FIELDS */
  // for each form, add required fields as list
  var fields = {
    default:[
      'admin1pcode',
      'admin2pcode',
      'admin3pcode',
    ],
    'Line List':[
      'diseaseCondition',
      'patientType',
      'name',
      'gender',
      'age',
      'kebeleTownHouseNo',
      'specimenTaken',
      'outcome'
    ],
  }

  // return list for xls form by form name
  return fields[ formName ];

});

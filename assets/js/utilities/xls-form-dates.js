/**
 * xlsFormDates()
 *
 * Fetch list of odk choices for a form
 *
 * -----------------------------------------------------------------
 * @param {Ref} formName
 * -----------------------------------------------------------------
 * @returns {json}
 *
 */

parasails.registerUtility('xlsFormDates', function xlsFormDates(formName) {

  /* XLSFORM REQUIRED FIELDS */
  // for each form, add required fields as list
  var dates = {
    'Line List':[
      'dateRecievedRaw',
      'diseaseOnsetDateRaw',
      'patientSeenAtHealthFacilityDateRaw'
    ],
  }

  // return list for xls form by form name
  return dates[ formName ];

});

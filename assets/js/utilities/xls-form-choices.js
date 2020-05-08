/**
 * xlsFormChoices()
 *
 * Fetch list of odk choices for a form
 *
 * -----------------------------------------------------------------
 * @param {Ref} formName
 * -----------------------------------------------------------------
 * @returns {json}
 *
 */

parasails.registerUtility('xlsFormChoices', function xlsFormChoices(formName) {

  /* XLSFORM OPTIONS */
  // form options from xlsForm
  // ODK does not include the form options in the database (from what I can see)
  // these could eventually be placed in a database table - for now they are copied from the xlsForm
  var choices = {
    'Line List':{
      diseases:[
        { name:'AFP_Polio', label: 'AFP/Polio' },
        { name:'Anthrax', label: 'Anthrax' },
        { name:'Avian_Human_Influenza', label: 'Avian Human Influenza' },
        { name:'Cholera', label: 'Cholera' },
        { name:'Dracunculiasis_Guinea_worm', label: 'Dracunculiasis (Guinea worm)' },
        { name:'Deaths_women_reproductive_age', label: 'Deaths of women of reproductive age (15-49)years' },
        { name:'Ebola', label: 'Ebola' },
        { name:'Maternal_Death_Suspected', label: 'Maternal Death (Suspected)' },
        { name:'Maternal_Death_Confirmed', label: 'Maternal Death (Confirmed )' },
        { name:'Measles', label: 'Measles ' },
        { name:'Neonatal_Tetanus', label: 'Neonatal Tetanus' },
        { name:'Pandemic_Influenza', label: 'Pandemic Influenza' },
        { name:'Rabies', label: 'Rabies ' },
        { name:'SARS', label: 'SARS' },
        { name:'Small', label: 'pox Small pox' },
        { name:'Viral_hemorrhagic_fever', label: 'Viral hemorrhagic fever' },
        { name:'Yellow_fever', label: 'Yellow fever' },
        { name:'Dengu_Fever', label: 'Dengu Fever' },
        { name:'Dysentery', label: 'Dysentery' },
        { name:'Malaria', label: 'Malaria' },
        { name:'Meningococcal_Meningitis', label: 'Meningococcal Meningitis' },
        { name:'Relapsing_Fever', label: 'Relapsing Fever' },
        { name:'Severe_Malnutrition', label: 'Severe Malnutrition' },
        { name:'Typhoid_Fever', label: 'Typhoid Fever' },
        { name:'Typhus', label: 'Typhus' }
      ],
      patientTypes:[
        { name:'In_Patient', label: 'In Patient' },
        { name:'Out_Patient', label: 'Out Patient' }
      ],
      genders:[
        { name:'Male', label: 'Male' },
        { name:'Female', label: 'Female' }
      ],
      yesNo:[
        { name:'yes', label: 'yes' },
        { name:'no', label: 'no' }
      ],
      outcomes:[
        { name:'Live', label: 'Live' },
        { name:'Dead', label: 'Dead' }
      ]
    }
  }

  // return list for xls form by form name
  return choices[ formName ];

});

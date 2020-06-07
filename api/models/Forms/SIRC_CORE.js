/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  // datastore
  // datastore: 'admin',

  // db tablename
  tableName: 'SIRC_CORE',

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    id:{
      type: 'string',
      required: true,
      columnName: '_URI'
    },
    createdAt: {
      type: 'ref',
      columnName: '_CREATION_DATE'
    },
    updatedAt: {
      type: 'ref',
      columnName: '_LAST_UPDATE_DATE'
    },
    creatorUser: {
      type: 'string',
      columnName: '_CREATOR_URI_USER'
    },
    isComplete: {
      type: 'boolean',
      columnName: '_IS_COMPLETE'
    },
    submissionDate: {
      type: 'ref',
      columnName: '_SUBMISSION_DATE'
    },
    markedAsCompleteDate:{
      type: 'ref',
      columnName: '_MARKED_AS_COMPLETE_DATE'
    },
    weekStartDate:{
      type: 'ref',
      columnName: 'START_DATE_OF_WEEK_FROM_MONDAY_EC'
    },
    weekEndDate:{
      type: 'ref',
      columnName: 'END_OF_WEEK_FROM_SUNDAY_EC'
    },
    afpPolioCases:{
      type: 'number',
      columnName: 'AFP_POLIO_CASE'
    },
    afpPolioDeaths:{
      type: 'number',
      columnName: 'AFP_POLIO_DEATH'
    },
    antraxCases:{
      type: 'number',
      columnName: 'ANTRAX_CASE'
    },
    antraxDeaths:{
      type: 'number',
      columnName: 'ANTRAX_DEATH'
    },
    choleraCases:{
      type: 'number',
      columnName: 'CHOLERA_CASE'
    },
    choleraDeaths:{
      type: 'number',
      columnName: 'CHOLERA_DEATH'
    },
    guineaWormCases:{
      type: 'number',
      columnName: 'DRACUNCULIASIS_GUINEA_WORM_CASE '
    },
    maternalDeath:{
      type: 'number',
      columnName: 'MATERNAL_DEATH'
    },
    measlesCases:{
      type: 'number',
      columnName: 'MEASLES_CASE'
    },
    measlesDeaths:{
      type: 'number',
      columnName: 'MEASLES_DEATH'
    },
    neonatalTetanusCases:{
      type: 'number',
      columnName: 'NEONATAL_TETANUS_CASE'
    },
    neonatalTetanusDeaths:{
      type: 'number',
      columnName: 'NEONATAL_TETANUS_DEATH'
    },
    influenzaCases:{
      type: 'number',
      columnName: 'PANDEMIC_INFLUENZA_CASE'
    },
    influenzaDeaths:{
      type: 'number',
      columnName: 'PANDEMIC_INFLUENZA_DEATH'
    },
    prenatalDeaths:{
      type: 'number',
      columnName: 'PERINATAL_DEATH'
    },
    rabiesCases:{
      type: 'number',
      columnName: 'RABIES_CASE'
    },
    sarsCases:{
      type: 'number',
      columnName: 'SARS_CASE'
    },
    sarsDeaths:{
      type: 'number',
      columnName: 'SARS_DEATH'
    },
    smallPoxCases:{
      type: 'number',
      columnName: 'SMALL_POX_CASE'
    },
    smallPoxDeaths:{
      type: 'number',
      columnName: 'SMALL_POX_DEATH'
    },
    viralHemorrhagicFeverCases:{
      type: 'number',
      columnName: 'VIRAL_HEMORRHAGIC_FEVER_CASE'
    },
    viralHemorrhagicFeverDeaths:{
      type: 'number',
      columnName: 'VIRAL_HEMORRHAGIC_FEVER_DEATH'
    },
    yellowFeverCases:{
      type: 'number',
      columnName: 'YELLOW_FEVER_CASE'
    },
    yellowFeverDeaths:{
      type: 'number',
      columnName: 'YELLOW_FEVER_DEATE'
    },
    otherDiseaseCases:{
      type: 'number',
      columnName: 'OTHER_DISEASE_CASE'
    },
    otherDiseaseDeaths:{
      type: 'number',
      columnName: 'OTHER_DISEASE_DEATH'
    },
    otherDiseaseName: {
      type: 'string',
      columnName: 'OTHER_DISEASE_NAME'
    },

    admin1pcode: {
      type: 'string',
      columnName: 'ADMIN1PCODE'
    },
    admin2pcode: {
      type: 'string',
      columnName: 'ADMIN2PCODE'
    },
    admin3pcode: {
      type: 'string',
      columnName: 'ADMIN3PCODE'
    },
    site_id: {
      type: 'string',
      columnName: 'SITE_ID'
    },



    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },


};

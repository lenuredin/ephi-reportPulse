/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  // datastore
  // datastore: 'admin',

  // db tablename
  tableName: 'LINE_LIST_CORE',

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
    specimenTaken:{
      type: 'string',
      columnName: 'SPECIMEN_TAKEN'
    },
    specimenTakenDate:{
      type: 'ref',
      columnName: 'SPECIMEN_SPECIMEN_TAKEN_DATE_EC'
    },
    specimenTakenDateRaw:{
      type: 'ref',
      columnName: 'SPECIMEN_SPECIMEN_TAKEN_DATE_EC_RAW'
    },
    diseaseOnsetDate:{
      type: 'ref',
      columnName: 'DATE_OF_ONSET_OF_DISEASE_EC'
    },
    diseaseOnsetDateRaw:{
      type: 'ref',
      columnName: 'DATE_OF_ONSET_OF_DISEASE_EC_RAW'
    },
    patientSeenAtHealthFacilityDate:{
      type: 'ref',
      columnName: 'DATE_SEEN_AT_HEALTH_FACILITY_EC'
    },
    patientSeenAtHealthFacilityDateRaw:{
      type: 'ref',
      columnName: 'DATE_SEEN_AT_HEALTH_FACILITY_EC_RAW'
    },
    dateRecieved:{
      type: 'ref',
      columnName: 'DATE_RECEIVED'
    },
    dateRecievedRaw:{
      type: 'ref',
      columnName: 'DATE_RECEIVED_RAW'
    },
    comments:{
      type: 'string',
      columnName: 'COMMENTS'
    },
    patientType:{
      type: 'string',
      columnName: 'PATIENT_TYPE'
    },
    gender:{
      type: 'string',
      columnName: 'GENDER'
    },
    age:{
      type: 'number',
      columnName: 'AGE'
    },
    name:{
      type: 'string',
      columnName: 'NAME'
    },
    reportingLevel:{
      type: 'string',
      columnName: 'REPORTING_LEVEL'
    },
    reportingLevel:{
      type: 'string',
      columnName: 'REPORTING_LEVEL'
    },
    labResult:{
      type: 'string',
      columnName: 'LAB_RESULT'
    },
    kebeleTownHouseNo: {
      type: 'string',
      columnName: 'KEBELE_TOWN_HOUSE_NO'
    },
    diseaseCondition: {
      type: 'string',
      columnName: 'DISEASE_CONDITION'
    },
    outcome:{
      type: 'string',
      columnName: 'OUTCOME'
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

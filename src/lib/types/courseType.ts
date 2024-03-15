export type course = {
    "id": "string",
    "courseTitle": "string",
    "specialty": 0,
    "units": 0,
    "coefficient": 0,
    "grade": 0,
    "gradePeriodDescription": "string",
    "calculateUnits": true,
    "calculateGrade": true,
    "registrationType": 0,
    "notes": "string",
    "groupPercent": 0,
    "parentCourse": "string",
    "coursePercent": 0,
    "calculated": true,
    "hours": 0,
    "ects": 0,
    "percentileRank": 0,
    "isPassed": 0,
    "dateModified": "string",
    "repeated": 0,
    "formattedGrade": "string",
    "course": "string",
    "student": 0,
    "gradeYear": {
      "id": 0,
      "identifier": 0,
      "additionalType": "string",
      "alternateName": "string",
      "description": "string",
      "image": "string",
      "name": "string",
      "url": "string",
      "dateCreated": "string",
      "dateModified": "string",
      "createdBy": 0,
      "modifiedBy": 0
    },
    "gradePeriod": {
      "id": 0,
      "identifier": 0,
      "additionalType": "string",
      "alternateName": "string",
      "description": "string",
      "image": "string",
      "name": "string",
      "url": "string",
      "dateCreated": "string",
      "dateModified": "string",
      "createdBy": 0,
      "modifiedBy": 0
    },
    "semester": {
      "id": 0,
      "identifier": 0,
      "additionalType": "string",
      "alternateName": "string",
      "description": "string",
      "image": "string",
      "name": "string",
      "url": "string",
      "dateCreated": "string",
      "dateModified": "string",
      "createdBy": 0,
      "modifiedBy": 0
    },
    "courseType": {
      "id": 0,
      "name": "string",
      "abbreviation": "string",
      "obligatoryType": true,
      "locales": [
        {
          "id": 0,
          "inLanguage": "string",
          "name": "string",
          "abbreviation": "string",
          "object": 0
        }
      ],
      "locale": {
        "id": 0,
        "inLanguage": "string",
        "name": "string",
        "abbreviation": "string",
        "object": 0
      }
    },
    "programGroup": 0,
    "examPeriod": {
      "id": 0,
      "name": "string",
      "isLate": true,
      "alternateName": "string",
      "periods": 0,
      "academicPeriods": [
        {
          "id": 0,
          "identifier": 0,
          "additionalType": "string",
          "alternateName": "string",
          "description": "string",
          "image": "string",
          "name": "string",
          "url": "string",
          "dateCreated": "string",
          "dateModified": "string",
          "createdBy": 0,
          "modifiedBy": 0
        }
      ],
      "locales": [
        {
          "id": 0,
          "inLanguage": "string",
          "name": "string",
          "alternateName": "string",
          "object": 0
        }
      ],
      "locale": {
        "id": 0,
        "inLanguage": "string",
        "name": "string",
        "alternateName": "string",
        "object": 0
      }
    },
    "lastRegistrationYear": {
      "id": 0,
      "identifier": 0,
      "additionalType": "string",
      "alternateName": "string",
      "description": "string",
      "image": "string",
      "name": "string",
      "url": "string",
      "dateCreated": "string",
      "dateModified": "string",
      "createdBy": 0,
      "modifiedBy": 0
    },
    "lastRegistrationPeriod": {
      "id": 0,
      "identifier": 0,
      "additionalType": "string",
      "alternateName": "string",
      "description": "string",
      "image": "string",
      "name": "string",
      "url": "string",
      "dateCreated": "string",
      "dateModified": "string",
      "createdBy": 0,
      "modifiedBy": 0
    },
    "courseStructureType": {
      "id": 0,
      "name": "string",
      "isComplete": true
    },
    "gradeExam": 0,
    "studyProgramSpecialty": "string",
    "childCourses"?: course[]
  }

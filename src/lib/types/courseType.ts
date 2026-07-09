export type AcademicPeriodType = {
    id: number;
    identifier: number | null;
    additionalType: string | null;
    alternateName: string | null;
    description: string | null;
    image: string | null;
    name: string | null;
    url: string | null;
    dateCreated: string | null;
    dateModified: string | null;
    createdBy: number | null;
    modifiedBy: number | null;
};

export type NewCourseType = {
    id: string;
    course: {
        id: string;
        displayCode: string;
        department: string;
        courseArea: number | null;
        name: string;
        subtitle: string | null;
        isEnabled: number;
        isShared: number;
        gradeScale: number;
        instructor: number | null;
        isCalculatedInScholarship: number;
        units: number | null;
        courseUrl: string | null;
        notes: string | null;
        replacedByCourse: string | null;
        replacedCourse: string | null;
        maxNumberOfRemarking: number | null;
        parentCourse: string | null;
        coursePartPercent: number | null;
        calculatedCoursePart: number;
        courseStructureType: number;
        courseSector: number | null;
        courseCategory: number | null;
        ects: number;
        isLocal: number;
        dateModified: string | null;
        calculatedInRegistration: number;
        metadata: string | null;
        locale: {
            id: string;
            object: string;
            inLanguage: string;
            name: string | null;
        } | null;
    };
    student: number;
    gradeYear: AcademicPeriodType;
    gradePeriod: AcademicPeriodType;
    courseTitle: string;
    semester: AcademicPeriodType;
    specialty: number;
    units: number;
    coefficient: number;
    grade: number | null;
    gradePeriodDescription: string | null;
    courseType: {
        id: number;
        name: string;
        abbreviation: string;
        obligatoryType: number;
        locale: {
            id: number;
            object: number;
            inLanguage: string;
            name: string;
            abbreviation: string;
        } | null;
    };
    calculateUnits: number;
    calculateGrade: number;
    registrationType: number;
    notes: string | null;
    programGroup: number | null;
    groupPercent: number | null;
    parentCourse: string | null;
    coursePercent: number | null;
    calculated: number;
    examPeriod: {
        id: number;
        name: string;
        isLate: number;
        alternateName: string;
        periods: number;
    } | null;
    hours: number | null;
    ects: number;
    lastRegistrationYear: AcademicPeriodType;
    lastRegistrationPeriod: AcademicPeriodType;
    percentileRank: number | null;
    courseStructureType: {
        id: number;
        name: string;
        isComplete: number;
    };
    isPassed: number;
    dateModified: string | null;
    repeated: number;
    formattedGrade: string | null;
    gradeExam: {
        id: number;
        course: string;
        year: number;
        examPeriod: number;
        description: string;
        notes: string | null;
        isLate: number;
        examDate: string | null;
        status: number;
        isCalculated: number;
        decimalDigits: number;
        name: string;
        resultDate: string | null;
        numberOfGradedStudents: number;
        completedByUser: number | null;
        dateCompleted: string | null;
        dateModified: string | null;
        gradeScale: number;
        instructors: {
            id: string;
            courseExam: number;
            instructor: {
                id: number;
                familyName: string;
                givenName: string;
                category: string;
                department: string;
                locale: {
                    id: number;
                    object: number;
                    inLanguage: string;
                    familyName: string;
                    givenName: string;
                    category: string;
                    expertise: string | null;
                    specialty: string | null;
                } | null;
            };
            dateModified: string | null;
        }[];
    } | null;
    studyProgramSpecialty: string | null;
    metadata: string | null;
    locale: {
        id: number;
        object: string;
        inLanguage: string;
        courseTitle: string | null;
        notes: string | null;
    } | null;
};

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

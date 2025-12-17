type index = "courseTitle" | "name" /*Both in courseClass.course.name and courseType.name */ | "abbreviation" | "semester" | "period" | "familyName" | "givenName" | "content" | "eudoxus";

export function localize(obj: any, field: index, lang = 'el') {
  if (lang === 'en' && obj.locale?.inLanguage === 'en') {
    return obj.locale[field] ?? obj[field];
  }
  return obj[field];
}
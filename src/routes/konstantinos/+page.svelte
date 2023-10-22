<script>
import { onMount } from "svelte";
import { universisGet } from "$lib/dataService";


let aem = "";
let inscriptionYear = "";
let fullName = "";
let schoolGraduated = "";
let birthDate = "";
let email = "";
let familyName = "";
let givenName = "";
let gender = "";
let mobilePhone = "";
let departmentName = "";
let departmentAddress = "";
let semester = "";

onMount(async () => {
	let personalData = await universisGet("Students/me/");
	let department = await universisGet('Students/me/department');
	console.log(personalData);
	aem = personalData.studentIdentifier;
	inscriptionYear = personalData.inscriptionYear.name;
	schoolGraduated = personalData.schoolGraduated;
	birthDate = personalData.person.birthDate.slice(0,10);
	email = personalData.person.email;
	familyName = personalData.person.familyName;
	givenName = personalData.person.givenName;
	gender = personalData.person.identityType;
	mobilePhone = personalData.person.mobilePhone;
	departmentName = department.abbreviation;
	departmentAddress = department.address;
	semester = personalData.semester;

});




</script>

<p>Hello {givenName}</p>
<p>AEM: {aem}</p>
<p>Inscription Year: {inscriptionYear}</p>
<p>School Graduated: {schoolGraduated}</p>
<p>Birth Date: {birthDate}</p>
<p>Email: {email}</p>
<p>Full Name: {givenName} {familyName}</p>
<p>Gender: {gender === 'Α' ? "Άντρας" : "Γυναίκα"}</p>
<p>Mobile Phone: {mobilePhone}</p>
<p>Department: {departmentName} {departmentAddress}</p>
<p>Semester: {semester}o</p>

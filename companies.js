const axios = require('axios');
const people = require ("./people.js");

const companiesUrl = "https://gist.githubusercontent.com/graffixnyc/90b56a2abf10cfd88b2310b4a0ae3381/raw/f43962e103672e15f8ec2d5e19106e9d134e33c6/companies.json";

async function getCompanies(){
    const { data } = await axios.get(companiesUrl);
    return data;
}

function onlySpaces(str) {
    return str.trim().length === 0;  
}

async function listEmployees(companyName){
    let peopleInCompany = [];
    let peopleInCompanyArr = [];
    let resultObj;
    let currCompany;

    try {
        if(companyName == null || companyName == undefined) throw 'Error: Company Name does NOT exist'
        if(typeof companyName !== 'string') throw 'Error: Company Name is NOT of proper type (string)'
        if(onlySpaces(companyName)) throw 'Error: Company Name argument is just empty spaces'

        const peopleData = await people.getPeople();
        const companiesData = await getCompanies();
        
        for(let el of companiesData){
            if(el.name == companyName){
                currCompany = el;
                break;
            }
        }

        if(currCompany == undefined || currCompany == null) throw `Error: No company name with ${companyName}`

        for(let el of peopleData){
            if(el.company_id == currCompany.id){
                peopleInCompany.push(el);
            }
        }

        peopleInCompany.sort((a, b) => {
            if (a === b) {
              return 0;
            }
            return a.last_name < b.last_name ? -1 : 1;
        });

        for(let k = 0; k < peopleInCompany.length; k++){
            let firstName = peopleInCompany[k].first_name;
            let lastName = peopleInCompany[k].last_name;
            let fullName = `${firstName + " " + lastName}`;

            peopleInCompanyArr.push(fullName);
        }

        if(peopleInCompany == null) throw "A person with that ID DOES NOT exist"

        resultObj = currCompany;
        resultObj.employees = peopleInCompanyArr;

    } catch (error) {
        console.log(error);
    }

    return resultObj;
}

async function sameIndustry(industry){
    let resultArr = [];

    try {
        if(industry == null || industry == undefined) throw 'Error: Industry argument does NOT exist'
        if(typeof industry !== 'string') throw 'Error: Industry argument is NOT of proper type (string)'
        if(onlySpaces(industry)) throw 'Error: Industry argument is just empty spaces'

        const companiesData = await getCompanies();
        
        for(let el of companiesData){
            if(el.industry == industry){
                resultArr.push(el);
            }
        }

        if(resultArr.length < 1) throw "Error: No companies in that industry"

    } catch (error) {
        console.log(error);
    }

    return resultArr;
}

async function getCompanyById(id){
    let result;

    try {
        if(id == null || id == undefined) throw 'Error: Id does NOT exist'
        if(typeof id !== 'string') throw 'Error: Id is NOT of proper type (string)'
        if(onlySpaces(id)) throw 'Error: Id argument is just empty spaces'

        const companiesData = await getCompanies();
        
        for(let el of companiesData){
            if(el.id == id){
                result = el;
            }
        }

        if(result == undefined || result == null) throw "Error: company not found"

    } catch (error) {
        console.log(error);
    }

    return result;
}

// listEmployees("Yost, Harris and Cormier");
// listEmployees("Kemmer-Mohr");
// listEmployees("Will-Harvey");
// listEmployees('foobar');
// listEmployees(123);

// sameIndustry('Auto Parts:O.E.M.');
// sameIndustry(43);
// sameIndustry(' ');
// sameIndustry('Foobar Industry');

// getCompanyById("fb90892a-f7b9-4687-b497-d3b4606faddf"); 
// getCompanyById(-1); 
// getCompanyById(1001); 
// getCompanyById();
// getCompanyById('7989fa5e-5617-43f7-a931-46036f9dbcff');

module.exports = {
    listEmployees,
    sameIndustry,
    getCompanyById
}
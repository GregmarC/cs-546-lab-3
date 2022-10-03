const axios = require('axios');

const peopleUrl = "https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json";

function onlySpaces(str) {
    return str.trim().length === 0;  
}

async function getPeople(){
    const { data } = await axios.get(peopleUrl);
    return data;
}

async function getPersonById(id){
    let person = null;

    try {
        if(id == null || id == undefined) throw 'Error: Id does NOT exist'
        if(typeof id !== 'string') throw 'Error: Id is NOT of proper type (string)'
        if(onlySpaces(id)) throw 'Error: Id argument is just empty spaces'

        const data = await getPeople();        
        for(let el of data){
            if(el.id == id){
                console.log("Found the person!");
                person = el;
            }
        }

        if(person == null) throw "Error: A person with that ID DOES NOT exist"

    } catch (error) {
        console.log(error);
    }

    return person;
}

// async function getTheGuy(id) {
//     let person = await getPersonById('41455e7d-b133-4aae-ac5d-a3a80567feb0');
//     console.log(person);
// }

async function sameJobTitle(jobTitle){
    let personArr = [];
    try {
        if(jobTitle == null || jobTitle == undefined) throw 'Error: Job Title does NOT exist'
        if(typeof jobTitle !== 'string') throw 'Error: Job Title is NOT of proper type (string)'
        if(onlySpaces(jobTitle)) throw 'Error: Job Title argument is just empty spaces'

        const data = await getPeople();        
        for(let el of data){
            if(el.job_title.toLowerCase() == jobTitle.toLowerCase()){
                personArr.push(el);
            }
        }

        if(personArr.length < 2) throw "Error: There are NOT 2 or more people that have this same job titel"

    } catch (error) {
        console.log(error);
    }

    return personArr;
}

//helper function for getPostalCodes function
const generateZipCodeMap = (data) => {
    let zipCodeMap = new Map();
    
    for(let el of data){
        let city = el.city.toLowerCase();
        let state = el.state.toLowerCase();
        let zip = el.postal_code;
        let cityAndState = `${city + ", " + state}`;

        if(zipCodeMap.has(cityAndState) && zipCodeMap.get(cityAndState).length > 0){
            if(!zipCodeMap.get(cityAndState).includes(zip)){
                zipCodeMap.get(cityAndState).push(zip);
            }
        }
        else if(!zipCodeMap.has(cityAndState)){
            zipCodeMap.set(cityAndState, [zip])
        }
    }

    return zipCodeMap;
}

async function getPostalCodes(city, state){
    let zipCodeMap;
    let zipCodeArr;

    try {
        if(city == null || city == undefined) throw 'Error: City does NOT exist'
        if(typeof city !== 'string') throw 'Error: City is NOT of proper type (string)'
        if(onlySpaces(city)) throw 'Error: City argument is just empty spaces'

        if(state == null || state == undefined) throw 'Error: State does NOT exist'
        if(typeof state !== 'string') throw 'Error: State is NOT of proper type (string)'
        if(onlySpaces(state)) throw 'Error: State argument is just empty spaces'

        let cityAndState = `${(city.toLowerCase()) + ", " + (state.toLowerCase())}`;

        const data = await getPeople();
        zipCodeMap = generateZipCodeMap(data);
        
        zipCodeArr = zipCodeMap.get(cityAndState);

        if(zipCodeArr == null || zipCodeArr == undefined || zipCodeArr.length < 1) throw 'Error: There are NO postal codes for the given city and state combination'
        zipCodeArr = zipCodeArr.sort();
        
    } catch (error) {
        console.log(error);
    }

    return zipCodeArr;
}

async function sameCityAndState(city, state){
    let personArr = [];

    try {
        if(city == null || city == undefined) throw 'Error: City does NOT exist'
        if(typeof city !== 'string') throw 'Error: City is NOT of proper type (string)'
        if(onlySpaces(city)) throw 'Error: City argument is just empty spaces'

        if(state == null || state == undefined) throw 'Error: State does NOT exist'
        if(typeof state !== 'string') throw 'Error: State is NOT of proper type (string)'
        if(onlySpaces(state)) throw 'Error: State argument is just empty spaces'

        const data = await getPeople();

        for(let el of data){
            if(el.city.toLowerCase() == city.toLowerCase() && el.state.toLowerCase() == state.toLowerCase()){
                let firstName = el.first_name;
                let lastName = el.last_name;
                let fullName = `${firstName + " " + lastName}`;
                personArr.push(fullName);
            }
        }

        if(personArr.length < 2) throw "Error: there are not two people who live in the same city and state"

    } catch (error) {
        console.log(error);
    }

    return personArr;
}

// getPersonById(-1); 
// getPersonById(1001);
// getPersonById();
// getPersonById('7989fa5e-5617-43f7-a931-46036f9dbcff');

// sameJobTitle(); 
// sameJobTitle("farmer");
// sameJobTitle(123);
// sameJobTitle(["Help Desk Operator"]);
// sameJobTitle(true);

// getPostalCodes("Salt Lake City", "Utah"); 
// getPostalCodes(); 
// getPostalCodes(13, 25); 
// getPostalCodes("Bayside", "New York");

// sameCityAndState("Salt Lake City", "Utah"); 
// sameCityAndState();
// sameCityAndState("    " , "      ");
// sameCityAndState(2, 29);
// sameCityAndState("Bayside", "New York");

module.exports = {
    getPeople,
    getPersonById,
    sameJobTitle,
    getPostalCodes,
    sameCityAndState
}






var baseUrl="http://localhost:8080/api/";
exports.getInstruments=async ()=>{
console.log("Fetching instruments...");
var response=await fetch(baseUrl+"instruments");
if(response.ok)
    var data=await response.json();
    console.log(data);
}

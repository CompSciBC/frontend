import { GuidebookDto } from "../../../utils/dtos";


function GuidebookLoader() : GuidebookDto {
  return  {
    propertyID: 'PID00178',
    propertyName: 'Happy Juice',
    propertyType: 'City',
    capacity: 5,
    amenities: ["Washer", "Dryer", "Hottub"],
    pets: 'Allowed',
    propertyBio: "lorem ipsum....",
    faq: [{
      Question: "Hand towels?",
      Answer: "No"
    },{
      Question: "Whatever",
      Answer: "No"
    },{
      Question: "Code",
      Answer: "No"
    }],
    policies: ["Must wash hands"],
    hostServices: [],
    propertySpecificQ: [], // change later to Hieu's Survey object
    checkininstr: [],
  };
}
// test
// function GuidebookLoader() : GuidebookDto {
//   return  {
//     propertyID: 'PID00178',
//     propertyName: 'Happy Juice',
//     propertyType: 'City',
//     capacity:'City',
//     amenities: 'City',
//     pets: 'Allowed',
//     propertyBio: "lorem ipsum....",
//     faq: 'City',
//     policies: 'City',
//     hostServices: 'City',
//     propertySpecificQ: 'City', // change later to Hieu's Survey object
//     checkininstr: 'City',
//     checkoutinstr: 'City'
//   };
// }


  
export default GuidebookLoader;
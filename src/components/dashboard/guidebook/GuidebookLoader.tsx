import { GuidebookDto } from "../../../utils/dtos";


function GuidebookLoader() : GuidebookDto {
  return  {
    propertyID: 'PID00178',
    propertyName: 'Waterfront Dream House',
    propertyType: 'Beach',
    capacity: 7,
    amenities: ["Washer", "Dryer", "Hottub", "Patio"],
    pets: 'Allowed',
    propertyBio: "Take in the views at the Waterfront Dream House. This tranquil, get-away for seven provides everything you'll need for a relaxing stay: private beach access, unobstructed water views, and easy access to many of the Island's best outdoor adventures. This newly renovated cabin features a stocked kitchen, indoor/outdoor dining and seating, and a spacious bedroom. We hope to make your stay as relaxing as possible with soft sheets, toiletries, Nespresso coffee machine, and memory foam mattress!",
    faq: [{
      Question: "Does this property provide towels?",
      Answer: "Yes! In the in-wall pantry next to the patio door."
    },{
      Question: "Are there animals on the property?",
      Answer: "We frequently have seagulls and bald eagles that swoop down!"
    },{
      Question: "Does it rain frequently?",
      Answer: "Since we are located in Washington, yes!"
    }],
    policies: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat justo eu pharetra interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce egestas, diam ac semper consequat, lacus odio suscipit lacus, venenatis commodo sem erat a nibh. Fusce sapien elit, ullamcorper nec purus quis, pharetra fermentum nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris pharetra metus non rutrum scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed aliquam in est vel lacinia. Proin eu sapien porttitor purus viverra consectetur ac sed tortor. Integer elementum dui sit amet bibendum suscipit."],
    hostServices: [],
    propertySpecificQ: [], // change later to Hieu's Survey object
  };
}
  
export default GuidebookLoader;
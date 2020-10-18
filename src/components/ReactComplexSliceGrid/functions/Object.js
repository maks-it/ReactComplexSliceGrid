/**
 * 
 * @param {object} obj 
 * @param {String[]} props 
 */
const PickObjectProps = (obj, props) => {
  // Make sure object and properties are provided
  if (!obj || !props) return

  // Create new object
  var picked = {}

  // Loop through props and push to new object
  props.forEach((prop) => {
    picked[prop] = obj[prop]
  })

  // Return new object
  return picked
}

export {
   PickObjectProps
}
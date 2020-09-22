/**
 * // pass in your object structure as array elements
 * const name = DeepCheck(user, ['personalInfo', 'name']);// to access nested array, just pass in array index as an element the path array.
 * const city = DeepCheck(user, ['personalInfo', 'addresses', 0, 'city']);
 * // this will return the city from the first address item.
 *
 */

export default function DeepCheck (nestedObj, pathArr) {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj)
}

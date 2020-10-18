/**
 * // pass in your object structure as array elements
 * const name = DeepCheck(user, ['personalInfo', 'name']);// to access nested array, just pass in array index as an element the path array.
 * const city = DeepCheck(user, ['personalInfo', 'addresses', 0, 'city']);
 * // this will return the city from the first address item.
 *
 */
const DeepCheck = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj)
  }


/** https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089 */
const  DeepCopy = (inObject) => {
    if (typeof inObject !== 'object' || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }
  
    // Create an array or object to hold the values
    const outObject = Array.isArray(inObject) ? [] : {}
  
    let value, key
    for (key in inObject) {
      value = inObject[key]
  
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = (typeof value === 'object' && value !== null) ? DeepCopy(value) : value
    }
  
    return outObject
  }


/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 * https://github.com/anneb
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
const DeepMerge = (target, source) => {
  // 21092020 - target must be a copy to avoid 'extensible problem
  target = DeepCopy(target)

  const isObject = (obj) => obj && typeof obj === 'object'

  if (!isObject(target) || !isObject(source)) {
    return source
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key]
    const sourceValue = source[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue)
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = DeepMerge(Object.assign({}, targetValue), sourceValue)
    } else {
      target[key] = sourceValue
    }
  })

  return target
}
  
export {
    DeepCheck,
    DeepCopy,
    DeepMerge
}
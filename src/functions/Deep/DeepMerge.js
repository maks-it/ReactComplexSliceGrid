/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 * https://github.com/anneb
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
import DeepCopy from './DeepCopy'

export default function DeepMerge (target, source) {
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

/*
export function MergeObjects(master, slave) {
    let obj = {};

    // clone all props from master master to obj
    Object.keys(master).forEach(key => {
        obj[key] = master[key]
    });

    // clone all props from slave slave to obj
    Object.keys(slave).forEach(key => {
        // if not array, just add or overwrtite master props with slave props
        if(!Array.isArray(obj[key])) {
            obj[key] = slave[key]
        }
        // if prop is array, things are more complicated, you need to merge arrays without duplicates
        else {
            switch (key) {
                case 'schema':
                    obj[key] = MergeArrayByPropVal(obj[key], slave[key], 1);
                break;

                default:
                    obj[key] = MergeArrayByPropVal(obj[key], slave[key], 0);
                break;
            }
        }
    });

    return obj;
} */

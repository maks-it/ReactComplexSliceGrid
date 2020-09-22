// @flow









  
  // Generics
  export function ToTitleCase(str: string) {
      return str.replace(/\w\S*/g,(txt) => {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
      );
  }
  
  export function ValidateGUID(str: string) {
    const rx = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  
    if(rx.test(str)) {
      return true;
    }
  
    return false;
  }
  
  export function RoundCurrency(num) {
    return parseFloat(Math.round(num * 100) / 100).toFixed(2);
  }
  
  
  
  
  
  
  
  
  
  
  // Work with urls
  export function GetDomainUrl(url: string) {
    const rx = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^\/?\n]+)/img  // with portnumber
    let result = url.match(rx);
    return result[0];
  }
  
  // returns domain.com or domain.co.uk
  export function GetBaseDomain(url: string) {
    const rx = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/img // without portnumber
    let result = url.match(rx);
  
    /**
     * Match anything that isn't a dot, three times, from the end of the line using the $ anchor.
     * The last match from the end of the string should be optional to allow for .com.au or .co.nz type of domains.
     * Both the last and second last matches will only match 2-3 characters, so that it doesn't confuse it with a second-level domain name.
     */
    const rx_1 = /[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/img
    result = result[0].match(rx_1);
  
    return result[0];
  }
  
  // have to be changed to regex
  // it.example.com
  export function Get2LvDomainLang(url: string) {
      let arr = url.split("/")[2].split(".");
  
      let result = "";
      if(arr[0].length === 2) {
          result = arr[0];
      }
  
      return result;
    }
  
  
  // have to be changed to regex
  // example.it
  export function GetDomainLang(url: string) {
    let arr = url.split("/")[2].split(".");
  
    let result = "";
    if(arr[arr.length-1].length === 2) {
        result = arr[arr.length-1];
    }
  
    return result;
  }
  
  
  
  
  
  
  
  
  
  
  
  /**
   * problem if there are unnecessary multiple values it creates an array instead of string object property
   */
  export function GetUrlParameters(search: string) {
      const rx = /(?:\?|&|;)([^=]+)=([^&|;]+)/g;
  
      let matches = [];
      let response = new Object();
  
      while ((matches = rx.exec(search)) !== null) {
        let key = matches[1];
        let value = matches[2];
  
        if(value !== '') {
          if(Object.prototype.hasOwnProperty.call(response, key)) {
            if(typeof response[key] === 'string') {
              response[key] = [response[key], value];
            }
            else {
              response[key].push(value);
            }
    
            // remove duplicates
            response[key] = [... new Set(response[key])];
          }
          else {
            response[key] = value;
          }
        }
        
        
      }
  
     
      return response;
  }
  
  export function BuildUrlSearchString(object: Object) {
    /**
     * is good to order properties alfabetically
     */
  
  
    let result = '';
    for(var property in object) {
      if(typeof object[property] === 'object') {
        for(let i = 0 ; i < object[property].length; i++){
          result += `${property}=${object[property][i]}&`;
        }
      }
      else {
        result += `${property}=${object[property]}&`;
      }
      
    }
  
    if(result !== '') {
      result = `?${result}`.replace(/^&+|&+$/g, '');
    }
  
    return result;
  }
  
  export function UpdateUrlParameters(search: string, key: String, value: string | number | bool) {
    let params = GetUrlParameters(search);
    params[key] = value;
    return BuildUrlSearchString(params);
  }
  
  export function DeleteUrlParameters(search: string, key: string) {
    let params = GetUrlParameters(search);
    // Deletion logic
    return BuildUrlSearchString(params);
  }
















  export function CheckEqual(value, other) {

    // Get the value type
    var type = Object.prototype.toString.call(value);
  
    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;
  
    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
  
    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
  
    // Compare two items
    var compare = function (item1, item2) {
  
      // Get the object type
      var itemType = Object.prototype.toString.call(item1);
  
      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!CheckEqual(item1, item2)) return false;
      }
  
      // Otherwise, do a simple comparison
      else {
  
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;
  
        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false;
        } else {
          if (item1 !== item2) return false;
        }
  
      }
    };
  
    // Compare properties
    if (type === '[object Array]') {
      for (var i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }
  
    // If nothing failed, return true
    return true;
  
  };
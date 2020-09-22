// parseUri 1.2.2 (not working well)
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// usage ParseUri.options.strictMode = true;

export function ParseUri (str) {
  var	o = ParseUri.options
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str)
  var uri = {}
  var i = 14

  while (i--) uri[o.key[i]] = m[i] || ''

  uri[o.q.name] = {}
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2
  })

  return uri
};

ParseUri.options = {
  strictMode: false,
  key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
}

// Maks-IT.com old implemntation
export function GetLocation (href) {
  // ignore http/s://www.
  // ^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)

  // match all until :
  // ([^:\/]+) - domain

  // match all untill /
  // ([^\/]+) - port

  // match all until ?
  // ([^\?]+)

  // match all remaining
  // (.*)

  const rx = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/]+)?([^\/]+)?([^\?]+)?(.*)/img
  const match = rx.exec(href)

  return {
    href: href,
    host: match[1],
    port: match[2],
    path: match[3],
    search: match[4]
  }
}

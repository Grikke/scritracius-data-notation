let arraySeparator = "(;)"
let objectAssign = "(:)"

const findClosing = (str, pos, bracket) => {
  let [opening, closing] = bracket
  if (str[pos] != opening)
    return -1;
  let check = 1;
  for (let i = pos + 1; i < str.length; i++) {
    switch (str[i]) {
    case opening:
      check++;
      break;
    case closing:
      if (--check == 0)
        return i;
      break;
    }
  }
  return -1;
}

const splice = (string, start, end) => {
  return string.slice(0, start) + string.slice(end);
}

const checkType = str => {
  switch (true) {
    case str.startsWith('[f]'):
      return 'function'
    case str.startsWith('[') && str.endsWith(']'):
      return 'array'
    case str.startsWith('{') && str.endsWith('}'):
      return 'object'
    case `${parseFloat(str)}` == str:
      return 'number'
    case str === "true" || str === "false":
      return 'boolean'
    default:
      return 'string'
  }
}
const renderPart = (part, type) => {
  let object, array, isNotEmpty, elem
  switch (type) {
    case 'object':
      object = {}
      part = part.slice(1, part.length - 1).trim()
      isNotEmpty = true
      while (isNotEmpty) {
        let name = part.split(objectAssign)[0].trim()
        part = splice(part, 0, part.search(objectAssign) +2).trim()
        let arrayPos = findClosing(part, 0, ['[', ']'])
        let objectPos = findClosing(part, 0, ['{', '}'])
        let pos = part.indexOf(arraySeparator) !== -1 ? part.indexOf(arraySeparator) : part.length
        if (!part.startsWith('[f]')) {
          if (arrayPos !== -1)
            pos = arrayPos + 1
          else if (objectPos !== -1)
            pos = objectPos + 1
        }
        elem = part.slice(0, pos).trim()
        part = splice(part, 0, pos)
        object = {...object, [name]: renderPart(elem, checkType(elem))}
        part = part.replace(arraySeparator, '')
        if (part.trim() === "")
          isNotEmpty = false
      }
      return object
    case 'array':
      array = []
      part = part.slice(1, part.length - 1)
      isNotEmpty = true
      while (isNotEmpty) {
        let arrayPos = findClosing(part, 0, ['[', ']'])
        let objectPos = findClosing(part, 0, ['{', '}'])
        let pos = part.indexOf(arraySeparator) !== -1 ? part.indexOf(arraySeparator) : part.length
        if (!part.startsWith('[f]')) {
          if (arrayPos !== -1)
            pos = arrayPos + 1
          else if (objectPos !== -1)
            pos = objectPos + 1
        }
        elem = part.slice(0, pos).trim()
        part = splice(part, 0, pos)
        array = [...array, renderPart(elem, checkType(elem))]
        part = part.replace(arraySeparator, '')
        if (part.trim() === "")
          isNotEmpty = false
      }
      return array
    case 'number':
      return parseFloat(part)
    case 'function':
      return eval(part.replace('[f]', ''))
    case 'boolean':
      return part === 'true'
    case 'string':
      return part
  }
}

const renderStr = data => {
  var str = ''
  switch (typeof data) {
    case "function":
      return `[f]${data}`
    case "string":
    case "number":
      return `${data}`
    case "boolean":
      return data ? "true" : "false"
    case "object":
      if (data.length) {
        str = '['
        data.forEach(e => {
          str += `${renderStr(e)}${arraySeparator}`
        })
        str += ']'
        return str
      }
      str = '{'
      Object.keys(data).forEach(key => {
        str += `${key}${objectAssign}${renderStr(data[key])}${arraySeparator}`
      })
      str += '}'
      return str
  }
}

const SDN = {
  parse: data => {
    data.trim()
    return renderPart(data, checkType(data))
  },
  stringify: data => {
    return renderStr(data)
  },
  [Symbol.toStringTag]: "SDN"
}
module.exports = SDN
const fs = require('fs');
const { exit } = require('process');
const SDN = require('../index')

let data = fs.readFileSync('./test/data.sdn', {encoding: 'utf-8'})

data = SDN.parse(data)
let dataStr = SDN.stringify(data)
let data2 = SDN.parse(dataStr)
let dataStr2 = SDN.stringify(data2)

if (dataStr === dataStr2) {
  console.log('Working')
  exit(0)
}
console.error('Something went wrong')
exit(1)
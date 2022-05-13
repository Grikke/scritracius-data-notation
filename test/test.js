const fs = require('fs');
const { exit, argv } = require('process');
const SDN = require('../index')

const myArgs = argv.slice(2);

let data, dataStr
switch (true) {
  case myArgs.includes('compare'):
    data = fs.readFileSync('./test/data.sdn', {encoding: 'utf-8'})

    data = SDN.parse(data)
    dataStr = SDN.stringify(data)
    let data2 = SDN.parse(dataStr)
    let dataStr2 = SDN.stringify(data2)

    if (dataStr === dataStr2) {
      console.log('Working')
      exit(0)
    }
    console.error('Something went wrong')
    exit(1)
  case myArgs.includes('function'):
    let test = {
      test: () => {
        let i = 0;
        console.log('Function is working')
        i++
        console.log('This is incrementing' + i)
      }
    }
    dataStr = SDN.stringify(test)
    data = SDN.parse(dataStr)
    try {
      data.test()
      exit(0)
    }
    catch (e) {
      console.log('Function is not working')
      exit(1)
    }
  default:
    console.log('No valid argument given')
    exit(0)
}
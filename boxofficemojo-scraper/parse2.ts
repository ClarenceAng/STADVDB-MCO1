import path from 'path'
import fs from 'fs/promises'
import { parse } from 'node-html-parser'
import { createObjectCsvWriter } from 'csv-writer'

const files = (await fs.readdir('out-urls')).map(x => [x, path.join('out-urls', x)])

const promises = files.map(file => async () => {
  return {
    name: file[0],
    data: await fs.readFile(file[1])
  }
}).map(x => x())

const parseMoney = (x) => parseFloat(x.replaceAll('$','').replaceAll(',','')) 

const passthroughLog = (x) => { console.log(x); return x }

const monthMap = {
  'Jan': 1,
  'Feb': 2,
  'Mar': 3,
  'Apr': 4,
  'May': 5,
  'Jun': 6,
  'Jul': 7,
  'Aug': 8,
  'Sep': 9,
  'Oct': 10,
  'Nov': 11,
  'Dec': 12,
}

const data = (await Promise.all(promises))
              .map(x => ({ name: x.name.split('.')[0], data: x.data }))
              .map(x => ({ name: x.name, data: x.data.toString('utf-8') }))
              .map(x => ({ name: x.name, document: parse(x.data) }))
              .map(passthroughLog)
              .map(x => {
                console.log("Parsing: ", x.name)
                return {
                  id: x.name,
                  imdb_id: /https:\/\/pro.imdb.com\/title\/(tt\d+)\?[a-z&_=]*/.exec([...x.document.querySelector('.mojo-summary-values').querySelectorAll('.a-link-normal')].map(x=>x.attributes.href).find(y=>y.includes("pro.imdb.com/title/tt")))[1]
                }
              })

const csvWriter = createObjectCsvWriter({
  path: 'box-office-ids.csv',
  header: [
    { id:'id', title: 'id' },
    { id:'imdb_id', title: 'imdb_id' }
  ]
})

await csvWriter.writeRecords(data)

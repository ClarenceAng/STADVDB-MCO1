import path from 'path'
import fs from 'fs/promises'
import { parse } from 'node-html-parser'
import { createObjectCsvWriter } from 'csv-writer'

const files = [...(await fs.readdir('out')).map(x => [x.split('_')[1], path.join('out', x)])]

const promises = files.map(file => async () => {
  return {
    name: file[0],
    data: await fs.readFile(file[1])
  }
}).map(x => x())

const parseMoney = (x) => parseFloat(x.replaceAll('$','').replaceAll(',','')) 

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

const urls = {} // hashmap

const data = (await Promise.all(promises))
              .map(x => ({ name: x.name.split('.')[0], data: x.data }))
              .sort((a,b) => new Date(a.name).getTime() > new Date(b.name).getTime())
              .map(x => ({ name: x.name, data: x.data.toString('utf-8') }))
              .map(x => ({ name: x.name, document: parse(x.data) }))
              .map(x => {
                console.log("Parsing: ", x.name)
                const movies = []
                const table = x.document.getElementById('table')
                if (!table) return []
                const rows = table.childNodes[0].childNodes[0].childNodes
                for (let i = 1; i < rows.length; i += 7) {
                  for (let day = 3; day <= 9; day++) {
                    let year = parseInt(x.name.split('-')[0])
                    const month = monthMap[rows[0].childNodes[day].innerText.split(' ')[1]]
                    const fileNameMonth = parseInt(x.name.split('-')[1])

                    if (!parseMoney(rows[i].childNodes[day].innerText)) continue

                    const gross = parseMoney(rows[i].childNodes[day].innerText)
                    const gross_to_date = parseMoney(rows[i+5].childNodes[day-2].innerText)
                    const days_released = parseInt(rows[i+6].childNodes[day-2].innerText)

                    // fixing date
                    // file date is JAN, data is DEC -> yr--
                    // file date is DEC, data is JAN -> yr++
                    if (month == 1 && fileNameMonth == 12) {
                      year++
                    } else if (month == 12 && fileNameMonth == 1) {
                      year--
                    }
					
					const boxofficemojo_url = /(\/release\/rl\d+)\/.*/.exec(rows[i].childNodes[1].childNodes[0].attributes.href)[1]
					
					if (!urls[boxofficemojo_url]) urls[boxofficemojo_url] = true

                    movies.push({
                      title: rows[i].childNodes[1].childNodes[0].innerText,
                      boxofficemojo_id: /\/release\/(rl\d+)\/.*/.exec(rows[i].childNodes[1].childNodes[0].attributes.href)[1],
                      date: new Date(`${rows[0].childNodes[day].innerText.split(' ').slice(1,3).join(' ')} ${year}`).toLocaleDateString('en-ZA', { day: '2-digit', month: '2-digit', year: 'numeric'}),
                      gross: Number.isNaN(gross) ? 'null' : gross,
                      gross_to_date: Number.isNaN(gross_to_date) ? 'null' : gross_to_date,
                      days_released:  Number.isNaN(days_released) ? 'null' : days_released,
                    })
                  }
                }
                return movies
              })
              .flat()

const csvWriter = createObjectCsvWriter({
  path: 'box-office.csv',
  header: [
    {id: 'title', title: 'title'},
    {id: 'boxofficemojo_id', title: 'boxofficemojo_id'},
    {id: 'date', title: 'date'},
    {id: 'gross', title: 'gross'},
    {id: 'gross_to_date', title: 'gross_to_date'},
    {id: 'days_released', title: 'days_released'},
  ]
})

await csvWriter.writeRecords(data)

await Bun.write("boxofficemojo_urls.txt", Object.keys(urls).join('\n'))

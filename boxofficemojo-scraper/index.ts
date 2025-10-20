import path from 'path'
import fs from 'fs/promises'
import https from 'https';

const agent = new https.Agent({ keepAlive: true });

var now = new Date();

var daysOfYear = [];

for (var d = new Date(2008, 2, 4); d <= now; d.setDate(d.getDate() + 7)) {
    daysOfYear.push(new Date(d));
}

const dayStrings = daysOfYear.map(x=>`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`)

let i = 0

const chunkSize = 10;

let j = 0

for (let i = 0; i < dayStrings.length; i += chunkSize) {
	const chunk = dayStrings.slice(i, i + chunkSize);
	const requests = await Promise.all(chunk.map(x=>fetch(`https://www.boxofficemojo.com/date/${x}/weekly`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			'Accept': 'text/html,application/xhtml+xml',
		},
		agent
	}).then(d=> {
		if (++j % 50 == 0) console.log(j)
		return d
	}).catch((e)=>console.error(x, e))))
	const texts = await Promise.all(requests.map(x=>x.text()))

	await Promise.all(texts.map((t, j) => {
		return fs.writeFile(path.join("out3", i + j + '_' + dayStrings[i + j] + '.html'), t)
	}))

	await new Promise((res,rej) => setTimeout(() => res(), 20000))
}


import path from 'path'
import fs from 'fs/promises'
import https from 'https';

const agent = new https.Agent({ keepAlive: true });

const urls = (await fs.readFile('boxofficemojo_urls.txt')).toString('utf-8').replaceAll('\r\n', '\n').split('\n').filter(x=>x!='')

let i = 0

const chunkSize = 20;

let j = 0

for (let i = 0; i < urls.length; i += chunkSize) {
	const chunk = urls.slice(i, i + chunkSize);
	const requests = await Promise.all(chunk.map(x=>fetch(`https://www.boxofficemojo.com${x}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			'Accept': 'text/html,application/xhtml+xml',
		},
		agent
	}).then(d=> {
		if (++j % chunkSize == 0) console.log(j)
		return d
	}).catch((e)=>console.error(x, e))))
	const texts = await Promise.all(requests.map(x=>x.text()))

	await Promise.all(texts.map((t, j) => {
		return fs.writeFile(path.join("out-urls", urls[i + j].split('/').at(-1) + '.html'), t)
	}))

	await new Promise((res,rej) => setTimeout(() => res(), 5000))
}


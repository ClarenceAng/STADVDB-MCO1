# stadvdb-scraping

## Scripts

To obtain the data, the following scripts must be run in order:

- `index.ts` - Scrapes all revenue page HTML data from BoxOfficeMojo from 1985 onwards, and places it in the `out` folder
- `parse.ts` - Parses the HTML in the `out` folder, generating `box-office.tsv` for the main revenue data, and `boxofficemojo_urls` to later scrape the IMDB URLs
- `get_movie_ids.ts` - Scrapes the individual movie pages HTML data to get the IMDB URLs and IMDB IDs, and places it in the `out-urls` folder
- `parse2.ts` - Parses the pages in the `out-urls` folder and matches each BoxOfficeMojo ID with its corresponding IMDB ID, and places the mapping in `box-office-ids.csv`

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

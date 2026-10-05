# Local helper scripts

These are development conveniences, not part of the site. They need Playwright,
which is installed on demand so it does not slow down deploys:

    npm i -D playwright
    npx playwright install chromium

Then, with the site running (`npm run dev` or `npm start`):

    node scripts/verify.mjs  http://localhost:3000   # checks overflow, both links, RTL
    node scripts/shoot.mjs   http://localhost:3000   # full-page screenshots
    node scripts/sections.mjs http://localhost:3000 en   # one image per section

Output lands in ./screenshots, for comparing against ./reference.

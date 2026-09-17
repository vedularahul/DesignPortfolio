# rahulvedula.com

Personal portfolio. One file, no build step, no dependencies.

```
index.html            landing page, including the hero game
style.css             shared styles for every case study page
paperpal.html         Cactus — The Paperpal story
r-discovery.html      Cactus — search-first homepage
zero-cost-sales.html  Cactus — monetising existing traffic
megamenu.html         Simplilearn — click-through +15%
chatbot.html          Simplilearn — ~2,800 hours a month
ticket-reduction.html Simplilearn — duplicate support tickets
lms.html              Simplilearn — learning platform redesign
peer-to-peer.html     Simplilearn — peer engagement research
resume-gate.js        résumé request form (see the notes at the top of that file)
CNAME                 add this only when you buy a domain
```

Keep all files in the same folder — the pages link to each other with relative paths.

## Put it on GitHub Pages

1. Create a repo. Name it `rahulvedula.github.io` if you want the clean URL, otherwise any name works.
2. Push `index.html` to the `main` branch.
3. Repo → **Settings** → **Pages** → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
4. Wait about a minute. Live at `https://<username>.github.io/<repo>/`.

```bash
git init
git add .
git commit -m "first fold"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## Point a domain at it later

1. Buy the domain (Namecheap, GoDaddy, Cloudflare — any registrar).
2. At the registrar, add these DNS records:

   | Type  | Host | Value |
   |-------|------|-------|
   | A     | @    | 185.199.108.153 |
   | A     | @    | 185.199.109.153 |
   | A     | @    | 185.199.110.153 |
   | A     | @    | 185.199.111.153 |
   | CNAME | www  | `<username>.github.io` |

3. Repo → Settings → Pages → Custom domain → enter the domain → Save.
4. Tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).

## Editing the game

Everything lives in the `<script>` block at the bottom of `index.html`.

- **Contact details** — `MAIL_PARTS`, `TEL_PARTS`, `WA_NUMBER` at the top. They're split into fragments and joined at runtime so the address isn't sitting in the page source for scrapers.
- **Reveal order** — the `SEGMENTS` array is a queue, not a per-target assignment. Each hit takes the next entry, so the email always completes before the phone starts no matter which target you shoot first. Reorder the array to change that.
- **Number of targets** — also the `SEGMENTS` array. Add or remove entries and the HUD pips follow automatically.
- **Difficulty** — `pad` inside the collision check widens the hitbox; the `0.085` in the bullet loop is how hard shots steer toward the nearest target. Both are set generous on purpose: five shots should always be enough.
- **Sprites** — `TARGET_A`, `TARGET_B`, `SHIP` are plain string arrays. `#` is a filled pixel, `.` is empty. Redraw them freely; the renderer reads the dimensions from the array.

## Behaviour worth knowing- Spacebar is only intercepted while the hero is on screen and the game is unfinished, so it still scrolls the page everywhere else.
- Touch devices get "tap anywhere to fire" and the ship auto-aims, since there's no cursor to track.
- If nobody interacts for nine seconds, a quiet "skip the game" link appears.
- `prefers-reduced-motion` skips the game entirely and shows the contact panel unlocked.
- Contact details are always in the footer regardless. The game is the fun route, never the only route.

## Filling in the case study

`paperpal.html` has five image slots. Each looks like this:

```html
<div class="shot"><span>REPLACE: ...</span></div>
```

Swap the whole `div` for an `<img src="img/whatever.png" alt="...">` and it will pick up the same border and sizing. Put the files in an `img/` folder next to the HTML.

Every case study page has the same five-to-two image slots and links `style.css`, so a change to spacing or colour there lands on all eight at once. `index.html` still carries its own copy of the tokens because it also holds the game CSS — if you change a colour, change it in both places.

The pages were generated from `build.py` (not in the repo). Editing the HTML directly is fine; just don't regenerate afterwards or you'll overwrite your edits.

## The résumé gate

`resume.pdf` is deliberately **not** in this repo. A static host serves every
file it holds to anyone who asks, so a PDF sitting here is public no matter
what the interface does. Every link that used to point at it now opens the
request form in `resume-gate.js` instead.

To receive requests in your inbox rather than through the visitor's mail
client, set `ENDPOINT` at the top of `resume-gate.js` to a form backend URL
(Formspree's free tier is enough). Until then it falls back to opening a
pre-filled mail draft, which works but loses anyone without a mail client.

If you ever want the PDF public again, drop it back in the folder and change
`href="#resume"` back to `href="resume.pdf"` across the ten pages.

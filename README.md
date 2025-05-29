# Nanogram Website on Next.js

## Planned features

- Next.js
- Mongodb Atlas (database)
- Cloudflare R2 (storage) (debit card 😔)
- Cloudinary (storage) (no cc 🤩) (only image and video 😔)
- UploadThing (storage) (2 GB 🤩)
- Appwrite or Clerk.dev (auth)
- Cleaner UI/UX with daisy UI
- Form builder and Blog builder

## Minor features (brainstorm)

- opengraph and twitter emmbeddings generation
- fun game, yes
- blogs can be md files, just an idea tho, not just an idea anymore turns out it's best fit for blogs

## Current Progress

- routes have been established
- navbar ui ready
- sidebar and bottombar ready
- Auth is ready but /callback needs attention & overall UI needs improvement. next hook up DB to auth
- Connected MongoDB to app and checked with schema creation
- Working towards adding a api route to generate open-graph images
- Added api routes to fetch from nanogram collection
- Added the hero section
- Completed Home page
- Added auth to api routes

## Challenges

- lack of good websocket infrastructure for free (messaging)
- that i don't follow html tag conventions (recheck every components exquisite young lad)

## .env codes
- [.env.local](https://gist.githubusercontent.com/Pramoda-S-R/25e2a6074970f20cfc2b34f48f3871af)

## How to use

```bash
npm run dev
```

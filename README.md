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

## What to do next

<!-- - api routes for events collection -->
<!-- - api logic for the entirity of events route -->
<!-- - fix the inconsistency in home and events route -->
- customize reverify dialog window
- bring all the clerk manage functions to frontend using reverification
- redo previous manage account features
- start work on the community group
- community ui
<!-- - connect uploadthing and establish blogs and newsletters -->
- subscribe to newsletter
<!-- - connect cloudinary and test out it's usage -->
<!-- - Revamped Navbar and community sidebar -->
<!-- - better api authentication allowing api key creation (mailjet perhaps) (no mailjet but still doable) -->
<!-- - admin auth proxy api -->
- make proxy secure
- community database rework
- admin dashboard
- censor board
- activity logs
- Dev/API page for developers
- Docs for the devs
- Terms of Service and Privacy policy
- dedicated backend
- mobile app and desktop app
- IP bans

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
- Completed About Us page
- Completed Events page (bug: home and events route has inconsistancy in layout)
- fixed the inconsistency
- Revamped Navbar and community sidebar
- Events page database fetching done
- made the manage account component but multiple features are still missing
- possible features from manage account: (revoke sessions, add_emails, add_connections?)
- add emails, add connections, revoke sessions, update password built 
- manage account ui complete
- uploadthing connected
- blog and newsletter api routes done
- cloudinary integrated and storage increased to 25GB 🤩
- post apis in place
- better api auth but unimplemented on many routes

## Challenges

- lack of good websocket infrastructure for free (messaging)
- that i don't follow html tag conventions (recheck every components exquisite young lad)
- clerk is a bitch and locks many features from the sdk (or so i thought I just suck at designing client side components for managinf accounts)

## .env codes

- [.env.local](https://gist.githubusercontent.com/Pramoda-S-R/25e2a6074970f20cfc2b34f48f3871af)

## How to use

```bash
npm run dev
```

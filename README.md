# Nanogram Website on Next.js

## Planned features

- Next.js
- Mongodb Atlas (database)
- Cloudflare R2 (storage) (debit card 😔) (not using)
- Cloudinary (storage) (no cc 🤩) (only image and video 😔)
- UploadThing (storage) (2 GB 🤩)
- Clerk.dev (auth)
- Upstash (Redis) (rate limiting)
- Ably (Web Socket) (messaging)
- Airtable (Tabular form data)
- Mailjet (Newsletters)
- Google Gemini (embeddings and ai)
- Qdrant (Vector search?)
- GraphQL (Better Querying)
- Cleaner UI/UX with daisy UI
- Shadcn for amazing UI
- Form builder and Blog builder

## Minor features (brainstorm)

- opengraph and twitter emmbeddings generation
- fun game, yes
- blogs can be md files, just an idea tho, not just an idea anymore turns out it's best fit for blogs

## What to do next

- [x] api routes for events collection
- [x] api logic for the entirity of events route
- [x] fix the inconsistency in home and events route
- [x] customize reverify dialog window
- [x] bring all the clerk manage functions to frontend using reverification
- [x] redo previous manage account features
- [x] test very email, delete email, (profile update, remove social connection, delete account)
- [ ] link api when user details are updated. T_T
- [x] start work on the community group
- [x] community ui
- [x] cleanup community UI
- [x] hook up ably to the backend
- [x] fix report button (airtable)
- [ ] figure out query schema
- [ ] set up ably listner for notifications
- [ ] add safety checks to message query
- [x] find a vector db
- [x] add like share comment save feature
- [ ] add karma feature
- [ ] add bio section in manage account
- [x] add intersection observer to comments and make it infini scroll
- [x] fix all users screen
- [x] add report post and comment feature (combination ui perhaps?)
- [x] connect uploadthing and establish blogs and newsletters
- [x] add 2fa check for POST, PUT, DELETE functions for devs
- [ ] subscribe to newsletter
- [x] connect cloudinary and test out it's usage
- [x] Revamped Navbar and community sidebar
- [x] better api authentication allowing api key creation (mailjet perhaps) (no mailjet but still doable)
- [x] admin auth proxy api
- [x] make proxy secure/ ditch proxy for server actions "use server"
- [x] community database rework
- [x] relationships using aggregate
- [x] add ai mascot
- [ ] give context to ai
- [x] gallery route
- [ ] fix the Contacts.tsx component (insert racial slur)
- [ ] add all models to graphql
- [ ] admin dashboard
- [ ] add UI to upload images to gallery
- [ ] check if admin by comparing a admin database
- [ ] censor board
- [ ] activity logs
- [ ] Dev/API page for developers
- [ ] Docs for the devs
- [ ] Terms of Service and Privacy policy
- [ ] mobile app and desktop app (I don't get paid enogh for tis)
- [ ] IP bans (make the game first exquisite young lad)

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
- rate limits added using redis
- proxy route added
- proxy route removed (I hate myself)
- server actions added
- added onboarding and user api route
- fixed manage account drawer completely testing remaining
- added posts api routes
- added new routes to handle user profile viewing, following etc.,
- worked on ui
- added embeds for posts
- community ui updated
- made onboarding fancier
- added explore page partially
- Newsletter and Blog UI updated
- Comment apis done
- Comments UI done
- Messages UI is done
- Ai mascot is here
- Gallery tab is done
- Added vector search for posts
- Fixed newsletters page
- Vector search blogs
- Vector and tag search for posts
- report post, comment and blog feature added
- graphql implemented lesgooo

## Challenges

- lack of good websocket infrastructure for free (messaging)
- that i don't follow html tag conventions (recheck every components exquisite young lad)
- clerk is a bitch and locks many features from the sdk (or so i thought I just suck at designing client side components for managinf accounts) (Ifiguerd it out I am the mistake)

## .env codes

- [.env.local](https://gist.githubusercontent.com/Pramoda-S-R/25e2a6074970f20cfc2b34f48f3871af)

## How to use

```bash
npm run dev
```

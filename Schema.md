## ** Collections and Schemas**

### ### 🧑‍💻 `users` collection

* Stores user profile and activity metrics (likes, karma, followers, etc.)

```ts
{
  _id: ObjectId,
  username: string,
  email: string,
  profileImageUrl: string,
  bio?: string,
  followers: ObjectId[],         // array of user IDs
  following: ObjectId[],
  likedPosts: ObjectId[],        // array of post IDs
  savedPosts: ObjectId[],
  karmaPoints: number,
  updatedAt: Date,
  createdAt: Date
}
```

---

### 📝 `posts` collection

* Stores user-generated posts (caption, tags, image, etc.)

```ts
{
  _id: ObjectId,
  authorId: ObjectId,         // reference to users._id
  caption: string,
  tags: string[],             // ["tech", "ai"]
  imageUrl: string,
  likes: number,
  commentsCount: number,
  updatedAt: Date,
  createdAt: Date
}
```

---

### 💬 `comments` collection

* Stores comments on posts

```ts
{
  _id: ObjectId,
  postId: ObjectId,           // reference to posts._id
  authorId: ObjectId,         // reference to users._id
  content: string,
  updatedAt: Date,
  createdAt: Date
}
```

---

### 📩 `messages` collection

* Stores user-to-user private messages

```ts
{
  _id: ObjectId,
  senderId: ObjectId,         // reference to users
  receiverId: ObjectId,
  content: string,
  sentAt: Date,
  isRead: boolean
}
```

---

### 📰 `newsletters` collection

* Stores newsletter metadata

```ts
{
  _id: ObjectId,
  title: string,
  fileUrl: string,
  publishedAt: Date
}
```

---

### 📖 `blogPosts` collection

* Stores references to Markdown files for blogs

```ts
{
  _id: ObjectId,
  title: string,
  fileUrl: string,
  publishedAt: Date,
  tags?: string[],
  author?: string
}
```

---

### 🎉 `events` collection

* Stores details of user or org-organized events

```ts
{
  _id: ObjectId,
  title: string,
  type: string,                 // e.g. "workshop", "hackathon"
  location: string,
  date: Date,
  description: string,
  summary: string,
  registrationLink: string,
  imageUrl: string,
  createdBy: ObjectId          // reference to users
}
```

---

### 🧑‍🤝‍🧑 `orgMembers` collection

* Stores org member info

```ts
{
  _id: ObjectId,
  name: string,
  role: string,
  testimony: string,
  imageUrl: string,
  socialLinks?: {
    linkedin?: string,
    github?: string,
    instagram?: string,
  },
  core: boolean,
  alumini: boolean,
}
```

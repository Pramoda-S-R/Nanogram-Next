# API Usage for Developers

This document provides a guide for developers to interact with our service's API.

## Authentication

All API requests require an API key for authentication. Developers must include their API key in the request headers under the `x-api-key` field.

Example:
`x-api-key: YOUR_API_KEY`

## Rate Limits

To ensure fair usage and system stability, the following rate limits are enforced:

* **Standard Developers**: 60 successful requests per minute.
* **Administrators**: 1000 successful requests per minute.

---

## API Endpoints

### Posts API

The `/api/posts` endpoint allows you to manage and retrieve posts.

#### Get Posts

Retrieves a list of posts based on specified criteria.

* **Method**: `GET`
* **Endpoint**: `/api/posts`
* **Search Parameters**:
    * `id`: `string[]` (optional) - An array of `ObjectId` strings to retrieve specific posts. If omitted, all posts are returned.
    * `sort`: `string` (optional) - The field by which to sort the results (e.g., `createdAt`, `likes`).
    * `order`: `number` (optional) - The sort order: `1` for ascending (asc) or `-1` for descending (desc).
    * `limit`: `number` (optional) - The maximum number of posts to return.
* **Returns**: An object containing an array of `AggregatePost` documents.
    ```json
    {
      "documents": AggregatePost[]
    }
    ```

#### Create Post

Creates a new post.

* **Method**: `POST`
* **Endpoint**: `/api/posts`
* **Form Data Parameters**:
    * `creator`: `string` (required) - The ID of the user creating the post.
    * `caption`: `string` (required) - The text content of the post.
    * `tags`: `string[]` (optional) - An array of tags associated with the post.
    * `image`: `File` (optional) - The image file to be uploaded with the post.
* **Returns**: The `_id` of the newly created post.
    ```
    created postId
    ```

#### Update Post

Updates an existing post.

* **Method**: `PUT`
* **Endpoint**: `/api/posts`
* **Form Data Parameters**:
    * `id`: `string` (required) - The `_id` of the post to update.
    * `caption`: `string` (optional) - The new text content for the post.
    * `tags`: `string[]` (optional) - The new array of tags for the post.
    * `image`: `File` (optional) - A new image file to replace the existing one.

#### Delete Post

Deletes a post.

* **Method**: `DELETE`
* **Endpoint**: `/api/posts`
* **Search Parameters**:
    * `id`: `string` (required) - The `_id` of the post to delete.

#### Like Post

Adds or removes a like from a post.

* **Method**: `PUT`
* **Endpoint**: `/api/posts/like`
* **Form Data Parameters**:
    * `postId`: `string` (required) - The `_id` of the post to like/unlike.
    * `userId`: `string` (required) - The `_id` of the user performing the like/unlike action.
* **Returns**: A message indicating the success of the operation.
    ```
    message
    ```

#### Save Post

Adds or removes a post from a user's saved posts.

* **Method**: `PUT`
* **Endpoint**: `/api/posts/save`
* **Form Data Parameters**:
    * `postId`: `string` (required) - The `_id` of the post to save/unsave.
    * `userId`: `string` (required) - The `_id` of the user saving/unsaving the post.
* **Returns**: A message indicating the success of the operation.
    ```
    message
    ```

---

### User API

The `/api/user` endpoint allows you to manage and retrieve user information.

#### Get Users

Retrieves a list of users based on specified criteria.

* **Method**: `GET`
* **Endpoint**: `/api/user`
* **Search Parameters**:
    * `id`: `string[]` (optional) - An array of MongoDB `_id` strings to retrieve specific user documents.
    * `name`: `string` (optional) - Filters users by their first or last name.
    * `username`: `string` (optional) - Filters users by their username.
    * `userId`: `string` (optional) - Filters users by their Clerk user ID (external authentication system ID).
    * `sort`: `string` (optional) - The field by which to sort the results (e.g., `createdAt`, `karma`).
    * `order`: `number` (optional) - The sort order: `1` for ascending (asc) or `-1` for descending (desc).
    * `limit`: `number` (optional) - The maximum number of users to return.
* **Returns**: An object containing an array of `User` documents.
    ```json
    {
      "documents": User[]
    }
    ```

#### Create User (Admin Only)

Creates a new user. This operation is restricted to administrators.

* **Method**: `POST`
* **Endpoint**: `/api/user`
* **Form Data Parameters**:
    * `userId`: `string` (required) - The Clerk user ID for the new user.
    * `username`: `string` (required) - The desired username for the new user.
    * `firstName`: `string` (required) - The first name of the new user.
    * `lastName`: `string` (required) - The last name of the new user.
    * `email`: `string` (required) - The email address of the new user.
    * `bio`: `string` (optional) - A short biography for the new user.
    * `avatarUrl`: `string` (required) - The URL to the user's avatar image.

#### Update User (Admin Only)

Updates an existing user's information. This operation is restricted to administrators.

* **Method**: `PUT`
* **Endpoint**: `/api/user`
* **Form Data Parameters**:
    * `userId`: `string` (required) - The Clerk user ID of the user to update.
    * `username`: `string` (optional) - The user's new username.
    * `firstName`: `string` (optional) - The user's new first name.
    * `lastName`: `string` (optional) - The user's new last name.
    * `email`: `string` (optional) - The user's new email address.
    * `bio`: `string` (optional) - The user's new biography.
    * `avatarUrl`: `string` (optional) - The URL to the user's new avatar image.
    * `karma`: `number` (optional) - The user's new karma score.
    * `role`: `"user" | "admin" | "moderator" | "dev"` (optional) - The user's new role.
    * `posts`: `string[]` (optional) - An array of `ObjectId` strings for posts created by the user.
    * `likedPosts`: `string[]` (optional) - An array of `ObjectId` strings for posts liked by the user.
    * `savedPosts`: `string[]` (optional) - An array of `ObjectId` strings for posts saved by the user.
    * `following`: `string[]` (optional) - An array of `ObjectId` strings for users the current user is following.
    * `followers`: `string[]` (optional) - An array of `ObjectId` strings for users who are following the current user.
    * `comments`: `string[]` (optional) - An array of `ObjectId` strings for comments made by the user.
    * `likedComments`: `string[]` (optional) - An array of `ObjectId` strings for comments liked by the user.
    * `createdAt`: `Date` (optional) - The creation timestamp of the user profile.
    * `updatedAt`: `Date` (optional) - The last update timestamp of the user profile.
* **Returns**: A message indicating the success of the operation.
    ```
    message
    ```

#### Delete User (Admin Only)

Deletes a user. This operation is restricted to administrators.

* **Method**: `DELETE`
* **Endpoint**: `/api/user`
* **Search Parameters**:
    * `user_id`: `string` (required) - The Clerk user ID of the user to delete.
* **Returns**: A message indicating the success of the operation.
    ```
    message
    ```

#### Follow/Unfollow User

Allows a user to follow or unfollow another user.

* **Method**: `PUT`
* **Endpoint**: `/api/user/folllow`
* **Form Data Parameters**:
    * `userId`: `string` (required) - The `_id` of the user initiating the follow/unfollow action.
    * `followUserId`: `string` (required) - The `_id` of the user to be followed/unfollowed.
* **Returns**: An object indicating success and the action performed.
    ```json
    {
      "success": true,
      "action": "follow" | "unfollow"
    }
    ``` 
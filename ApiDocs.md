# Api Docs

## /api/posts
- **GET**
    - search params
        - id: []
        - sort
        - order
        - limit
    - returns
        - { documetns: [] }

- **POST**
    - form data
        - creator
        - caption
        - tags [] (optional)
        - image (optional)
    - returns
        - created postId

- **PUT**
    - form data
        - id 
        - caption
        - tags: [] (optional)
        - image (optional)

- **DELETE**
    - search params
        - id

- ### /api/posts/like
    - **PUT**
        - form data
            - postId
            - userId
        - returns
            - message

- ### /api/posts/save
    - **PUT**
        - form data
            - postId
            - userId
        - returns
            - message

## /api/user
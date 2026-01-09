# API Menu App

Server: `http://localhost:5055`  
Swagger: `http://localhost:5055/api-docs`

## Autentikasi
- Skema: Bearer JWT
- Header: `Authorization: Bearer <token>`
- Token dibuat dengan expiry 1 hari

## Admin
- Register
  - POST `/api/admin/register`
  - Body (JSON): `{ "username": "string", "email": "string", "password": "string" }`
  - Response 201: `{ _id, username, email, token }`
- Login
  - POST `/api/admin/login`
  - Body (JSON): `{ "email": "string", "password": "string" }`
  - Response 200: `{ _id, username, email, token }`
- Get Profile
  - GET `/api/admin/profile`
  - Auth: Bearer token
  - Response 200: `{ _id, username, email }`
- Update Profile
  - PUT `/api/admin/profile`
  - Auth: Bearer token
  - Body (JSON): `{ "username"?: "string", "email"?: "string", "password"?: "string" }`
  - Response 200: `{ _id, username, email, token }`

## Categories
- Create Category
  - POST `/api/categories`
  - Auth: Bearer token
  - Content-Type: `multipart/form-data`
  - Fields:
    - `name`: string (required, unique)
    - `image`: file (required)
  - Response 201: Category document
- Get All Categories
  - GET `/api/categories`
  - Response 200: `Category[]`
- Get Category By ID
  - GET `/api/categories/:id`
  - Response 200: Category document
- Update Category
  - PUT `/api/categories/:id`
  - Auth: Bearer token
  - Content-Type: `multipart/form-data`
  - Fields:
    - `name`: string
    - `image`: file (opsional) atau `image` string path
  - Response 200: Category document
- Delete Category
  - DELETE `/api/categories/:id`
  - Auth: Bearer token
  - Response 200: `{ "message": "Category removed" }`

## Menus
- Create Menu
  - POST `/api/menus`
  - Auth: Bearer token
  - Content-Type: `multipart/form-data`
  - Fields:
    - `category`: ObjectId (required) referensi Category
    - `name`: string (required)
    - `description`: string (required)
    - `time`: number (required)
    - `slot`: number (required)
    - `image`: file (required)
  - Response 201: Menu document
- Get All Menus
  - GET `/api/menus`
  - Query opsional:
    - `keyword`: string (regex case-insensitive pada field `name`)
  - Response 200: `Menu[]` dengan `category` terpenuhi (`populate`)
- Get Menu By ID
  - GET `/api/menus/:id`
  - Response 200: Menu document dengan `category` terpenuhi
- Update Menu
  - PUT `/api/menus/:id`
  - Auth: Bearer token
  - Content-Type: `multipart/form-data`
  - Fields:
    - `category`: ObjectId
    - `name`: string
    - `description`: string
    - `time`: number
    - `slot`: number
    - `image`: file (opsional) atau `image` string path
  - Response 200: Menu document
- Delete Menu
  - DELETE `/api/menus/:id`
  - Auth: Bearer token
  - Response 200: `{ "message": "Menu removed" }`
- Get Menus By Category
  - GET `/api/menus/category/:categoryId`
  - Response 200: `Menu[]` dengan `category` terpenuhi

## Uploads
- Folder penyimpanan: `/uploads`
- Static hosting: `GET /uploads/<filename>`
- Penamaan file: `<fieldname>-<timestamp><ext>`
- Format yang diterima: `.jpg`, `.jpeg`, `.png`

## Contoh Curl
- Login
  ```bash
  curl -X POST http://localhost:5055/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}'
  ```
- Buat Category
  ```bash
  curl -X POST http://localhost:5055/api/categories \
    -H "Authorization: Bearer <TOKEN>" \
    -F "name=Makanan" \
    -F "image=@/path/to/makanan.jpg"
  ```
- Buat Menu
  ```bash
  curl -X POST http://localhost:5055/api/menus \
    -H "Authorization: Bearer <TOKEN>" \
    -F "category=<CATEGORY_ID>" \
    -F "name=Nasi Goreng" \
    -F "description=Nasi goreng spesial" \
    -F "time=15" \
    -F "slot=20" \
    -F "image=@/path/to/nasigoreng.jpg"
  ```

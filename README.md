# Wanderlust

Wanderlust is a full-stack travel listing web app where users can explore stays, create listings, upload images, and add reviews.

## Live Demo

https://wanderlust-rose-gamma.vercel.app

## Features

- User authentication (sign up, login, logout) with Passport.js
- Create, edit, and delete listings
- Upload listing images with Cloudinary + Multer
- Add and delete reviews with ratings
- Authorization checks for listing/review ownership
- Search listings by country
- Category-based listing filters
- Flash messages for success/error feedback
- Persistent sessions with MongoDB session store

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: Passport.js, passport-local, passport-local-mongoose
- Templating: EJS, ejs-mate
- Validation: Joi
- File Uploads: Multer, Cloudinary, multer-storage-cloudinary
- Sessions: express-session, connect-mongo

## Project Structure

```text
Wanderlust/
|-- app.js
|-- cloudConfig.js
|-- middleware.js
|-- schema.js
|-- controllers/
|-- models/
|-- routes/
|-- views/
|-- public/
`-- init/
```

## Environment Variables

Create a `.env` file in the project root and add:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

## Local Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Add your `.env` file (see above).
4. Start the server:

```bash
node app.js
```

5. Open:

```text
http://localhost:8080
```

## Notes

- Node version is set to `24` in `package.json` engines.
- Home route redirects to `/listings`.

# Rumah Kucing Booking System

This is a full-stack Next.js (App Router) application built with Tailwind CSS, Prisma, and PostgreSQL for managing cat boarding bookings.

## 🚀 Setup Instructions

### 1. Database Configuration
By default, this project uses PostgreSQL. 
- Create a PostgreSQL database (e.g., using Supabase, Neon, or locally).
- Rename `.env.example` to `.env`.
- Update `DATABASE_URL` in your `.env` file to match your database connection string.

### 2. Prisma Setup
Run the following commands to generate the Prisma client and push your schema to the database:
```bash
npx prisma generate
npx prisma db push
```
*(If you want to use migrations instead of db push, run `npx prisma migrate dev --name init`)*

### 3. Running the App Locally
Install dependencies if you haven't already:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Project Structure

- `src/app/page.tsx` - The landing page.
- `src/app/book/page.tsx` - The booking form where users select dates and enter details.
- `src/app/payment/[bookingId]/page.tsx` - Payment instruction and receipt upload.
- `src/app/admin/page.tsx` - Admin dashboard to manage and verify bookings.
- `src/app/api/upload/route.ts` - Simple API route handling local file uploads to `/public/uploads`.
- `prisma/schema.prisma` - Database schema defining the `Booking` model.

## 🎨 Theme Configuration
The application uses custom CSS variables within `src/app/globals.css` to define the pastel cat-friendly color palette, integrated seamlessly with Tailwind CSS.

## 🔒 Notes on Production
- **File Uploads**: The current upload API saves files locally to `public/uploads`. For production (especially on Vercel), you **must** switch this to a cloud storage provider like AWS S3 or Supabase Storage, as local files are not persisted on serverless platforms.
- **Admin Authentication**: The `/admin` route is currently unprotected. In a production app, implement NextAuth.js or basic authentication middleware to restrict access.

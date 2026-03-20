Prompt:

Build a minimal but complete e-commerce web app for selling artwork and paintings.

⚠️ Important Instructions:

Output the FULL codebase, not partial examples.

Do NOT summarize or skip files.

Generate all necessary files with their full contents.

Use clear file paths before each file (e.g., /pages/index.tsx).

The project must be ready to run after setup.

Tech Constraints

Use Next.js with Pages Router (not App Router)

Use Supabase (database + auth)

Use JavaScript or TypeScript (prefer TypeScript if possible)

Follow clean, scalable architecture

Core Features

1. Authentication

Google OAuth and email/password (Supabase Auth)

Only authenticated users can purchase

2. Roles

One admin user

Admin can:

Create, edit, delete products

Configure product filters

3. Products

Stored in Supabase

Fields:

title, price, description

images (multiple)

details

technical specifications

category / filters

4. Product Detail Page

Main image

Image carousel

Full product info

Message: “Shipping to be coordinated with the seller”

5. Shop Page

Fetch products from DB

Dynamic filters (admin-controlled)

6. Cart

Add to cart

Mini cart preview

Full cart page

7. Payments

Integrate Mercado Pago Checkout Pro

Payment options:

Mercado Pago

Bank transfer

8. UI / Design

Minimalist

Colors: #000, #333, beige tones

Required Output Structure

You MUST generate:

1. Full Project Structure

Show complete folder tree

2. Full Codebase

Include ALL files, such as:

/pages/* (Pages Router)

/components/*

/lib/*

/styles/*

/utils/*

/hooks/* (if needed)

/context/* (cart, auth, etc.)

/pages/api/* (API routes, Mercado Pago integration)

Config files:

package.json

tsconfig.json

.env.example

next.config.js

3. Functional Implementations

Supabase client setup

Auth (Google + email)

Admin logic

Product CRUD

Filters system

Cart state management

Mercado Pago Checkout Pro integration (API route + frontend)

Documentation Requirement

Also create a file:

/documentation.md (IN SPANISH)

It must include:

How the app works (complete explanation)

Folder structure explanation

Authentication flow

Admin system

Product & filters management

Cart and checkout flow

API integrations:

Supabase

Mercado Pago (detailed)

Where and how to modify:

API keys

Endpoints

Integrations

Environment variables setup

How to run locally

How to deploy

Output Rules

Do NOT skip files

Do NOT explain outside the code unless necessary

Keep code clean and production-ready

Use realistic, working implementations (no pseudo-code)
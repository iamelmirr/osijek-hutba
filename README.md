# Hutbaapp

Jednostavna Next.js aplikacija za objavu hutbi s automatskim prijevodom (en, ar, sq, bn, ur). Frontend + serverless na Vercel, baza na Supabase (free tier).

## Stack

- Next.js 14 (App Router, TS)
- Tailwind CSS
- Supabase (Postgres + RLS) — public read, insert preko service role
- OpenAI (gpt-4o-mini) — sekvencijalni prijevod
- Jednostavna admin lozinka (`ADMIN_PASSWORD`) za POST /api/hutbas

## Setup lokalno

1. `npm i`
2. Kreiraj Supabase projekt -> zapiši `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. U Supabase SQL editoru pokreni `db/schema.sql` (kreira tablicu + RLS).
4. Napuni `.env.local` prema `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...` (Service key iz Supabase — čuvaj ga kao tajnu)
   - `OPENAI_API_KEY=...`
   - `ADMIN_PASSWORD=neka-jaka-lozinka`
5. `npm run dev` i otvori `http://localhost:3000`.

## Korištenje

- Prvi ulazak: modal za odabir jezika (snima se u localStorage).
- Početna: najnovija hutba istaknuta; ispod još nekoliko; link za arhivu.
- Arhiva: kartice hutbi.
- Detalj: naslov + tekst po odabranom jeziku (fallback na hr).
- Admin: `/admin`
  - Unesi naslov (hr), tekst (hr), admin lozinku.
  - Submit -> API prevodi sekvencijalno -> kad svi prijevodi uspiju -> insert u DB -> redirect.

## Deploy

- Repo na GitHub.
- Vercel: Import repo -> postavi env varijable iz `.env.example`.
- Supabase: već podešen; provjeri RLS policy.
- Test: kreiraj probnu hutbu.

## Sigurnost

- `SUPABASE_SERVICE_ROLE_KEY` i `OPENAI_API_KEY` su SAMO server side tajne (Vercel env, ne klijent).
- Public read samo SELECT; nema INSERT/UPDATE/DELETE za `anon`.

## Trošak

- Vercel (Hobby) i Supabase (Free) su besplatni za ~100 korisnika mjesečno. OpenAI naplaćuje pozive (kratke hutbe su jeftine).
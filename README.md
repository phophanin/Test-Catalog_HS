# HOME SPORT - Cambodia Premier Football & Sports Catalog

A production-ready digital product catalog and order conversion platform designed for **HOME SPORT**, specializing in football boots, official jerseys, team kits, and sports accessories in Cambodia.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL)**.

---

## ⚽ Key Features

### 1. Dual Language & Dual Currency
- **Primary Language:** Khmer (ភាសាខ្មែរ)
- **Secondary Language:** English
- **Currencies:** USD ($) & Cambodian Riel (៛) with live exchange rate conversion (default 1 USD = 4,100 KHR).
- Instant header toggles that persist user preferences.

### 2. High-Conversion Catalog & Order Engine
Instead of high-friction checkout carts, HOME SPORT leverages Cambodia's predominant social commerce flow:
- **Product → Select Size → Order Now → Contact HOME SPORT**
- Pre-filled **Telegram** message (`@homesportkh`) with product name, SKU, size, color, quantity, and total price.
- Pre-filled **Facebook Messenger** direct link (`m.me/homesportcambodia`).
- Direct **Phone Call** hotline (`+855 12 345 678`).
- Automatic lead capture to the database (`order_leads`) so store admins never miss an inquiry.

### 3. Multi-Faceted Product Filtering (Section 15)
Filters work seamlessly together:
- **Category:** Football Boots, Jerseys, Shorts, Bags, Caps, Gloves, Socks, Accessories
- **Brand:** Nike, Adidas, Puma, Joma, Mizuno, Other
- **Price Range:** Under $20, $20-$50, $50-$100, $100+
- **Size:** Boots (EU 38-45), Apparel (S-3XL)
- **Color:** Black, White, Red, Blue, Volt, Yellow, Silver
- **Stock Status:** In Stock, Low Stock, Out of Stock
- **Badges:** SALE, NEW, BEST SELLER

### 4. Admin Management Dashboard
- `/admin` — Metrics, inventory alerts, recent order conversions.
- `/admin/products` — Product table, search, filter, stock status, edit/delete.
- `/admin/products/new` — Add products with dual language titles, sizes, prices, and specs.
- `/admin/products/[id]/edit` — Edit existing products.
- `/admin/categories` — Category management with live product counts.
- `/admin/brands` — Brand management with logos, origin countries, and biographies.
- `/admin/orders` — Customer lead pipeline (New, Contacted, Completed, Cancelled).
- `/admin/settings` — Store details, social usernames, USD/KHR exchange rate.

---

## 🚀 Quick Start (Local Run)

1. **Clone and Install dependencies:**
```bash
npm install
```

2. **Run Development Server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view HOME SPORT.

> **Note on Zero-Configuration:** The application works **100% out of the box** in resilient mock mode with rich sports seed data even before connecting Supabase credentials!

---

## 🗄️ Supabase Setup (PostgreSQL)

When you are ready to connect to your live Supabase cloud project:

1. Create a project on [https://supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Run the schema script: `supabase/schema.sql`
4. Run the seed data script: `supabase/seed.sql`
5. In `.env.local` (or Vercel Environment Variables), set:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
The app will automatically switch from local fallback mode to live PostgreSQL!

---

## 🌐 Deploy to Vercel

1. Push this repository to **GitHub**.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the environment variables from `.env.example`:
   - `NEXT_PUBLIC_STORE_NAME`: `HOME SPORT`
   - `NEXT_PUBLIC_STORE_PHONE`: `+855 12 345 678`
   - `NEXT_PUBLIC_STORE_TELEGRAM`: `homesportkh`
   - `NEXT_PUBLIC_STORE_MESSENGER`: `homesportcambodia`
   - `NEXT_PUBLIC_USD_TO_KHR_RATE`: `4100`
   - `NEXT_PUBLIC_SUPABASE_URL`: *(Your Supabase URL)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(Your Supabase Anon Key)*
4. Click **Deploy**.

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home (11 Sections)
│   │   ├── products/
│   │   │   ├── page.tsx                # Catalog & Filters
│   │   │   └── [slug]/page.tsx         # Product Detail & Order Modal
│   │   ├── category/[slug]/page.tsx    # Category Products
│   │   ├── brand/[slug]/page.tsx       # Brand Products
│   │   ├── search/page.tsx             # Live Search
│   │   ├── about/page.tsx              # About HOME SPORT
│   │   ├── contact/page.tsx            # Contact & Inquiry Form
│   │   └── admin/                      # Complete Admin Suite
│   ├── components/
│   │   ├── layout/                     # Sticky Header, Footer
│   │   ├── product/                    # ProductCard, Grid, Filters, OrderLeadModal
│   │   └── admin/                      # ProductForm
│   ├── lib/
│   │   ├── context/                    # LanguageContext (KM/EN), CurrencyContext (USD/KHR)
│   │   ├── data/                       # Unified store & Mock Sports Data
│   │   └── supabase/                   # Supabase client helper
│   └── types/                          # Full TypeScript interfaces
└── supabase/
    ├── schema.sql                      # PostgreSQL Schema & RLS
    └── seed.sql                        # Initial Seed Data
```

---

## 🏆 Brand Attribution
Developed with genuine athletic craftsmanship for **HOME SPORT Cambodia**.
"YOUR GAME. YOUR STYLE."

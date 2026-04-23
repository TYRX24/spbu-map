# SPBU — Peta Stasiun Bahan Bakar Jawa Barat

Aplikasi peta interaktif SPBU di Jawa Barat berbasis data OpenStreetMap.

## Fitur

- 🗺️ **Peta real** berbasis Leaflet + OpenStreetMap (bukan SVG statis)
- ⛽ **447 SPBU nyata** — Pertamina, Shell, BP, Vivo
- 🔍 **Search & Filter** — cari by nama, area, filter by brand & jenis BBM
- 🧭 **Routing OSRM** — petunjuk arah dari lokasi user ke SPBU pilihan
- 📍 **Geolocation** — deteksi lokasi user otomatis + hitung jarak terdekat
- 🌙 **Dark / Light mode** — beserta 3 gaya peta (Standard, Satellite, Minimal)
- 🌐 **Bilingual** — Bahasa Indonesia & English
- 📱 **Panel detail** — jam operasi, jenis BBM + harga, fasilitas, link OSM

## Tech Stack

- **React 18** + **Vite 5**
- **Leaflet** + **react-leaflet** — peta interaktif
- **OSRM** (public API) — routing
- Data dari **OpenStreetMap** (GeoJSON)

## Cara Jalankan

```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Build production
npm run build
```

## Deploy ke Vercel

1. Push repo ini ke GitHub
2. Login [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework: **Vite** (auto-detected)
4. Klik **Deploy** ✅

## Struktur Project

```
src/
├── components/
│   ├── Map.jsx          # Leaflet map + markers per brand
│   ├── Sidebar.jsx      # Search, filter, daftar SPBU
│   ├── StationDetail.jsx# Panel detail + routing result
│   ├── TweaksPanel.jsx  # Dark/light, map style, sidebar side
│   └── Icon.jsx         # SVG icons + BrandChip
├── hooks/
│   └── useRouting.js    # OSRM routing hook
├── data/
│   └── spbu.json        # 447 SPBU (merged dari 4 GeoJSON brand)
├── constants.js         # BRANDS, FUELS, I18N, AMENITY_LABELS
├── App.jsx              # Root component
└── main.jsx             # Entry point
```

## Sumber Data

Data SPBU bersumber dari **OpenStreetMap** via Overpass API,
di-merge dari 4 file GeoJSON per brand (Pertamina, Shell, BP, Vivo).

| Brand | Jumlah |
|---|---|
| Pertamina | 381 |
| Shell | 43 |
| Vivo | 14 |
| BP | 9 |
| **Total** | **447** |

## Kelompok

TPBW-46-G12 · Teknik Komputer · Telkom University

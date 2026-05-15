# 🗺️ Kiddomap · KL Family Fun Map

> Pick a kid-friendly KL place in 3 minutes.

Kiddomap is a playful map for parents in Kuala Lumpur. It helps families quickly choose indoor, outdoor, and saved places for kids.

## ✨ Features

- 🗺️ Cute map experience with Mapbox
- 📍 21 kid-friendly KL places
- 🎨 Soft candy colors and playful UI
- ⭐ Google rating references
- 🚗 One-tap navigation with Google Maps or Waze
- ❤️ Saved places on the device
- 💬 Feedback collected through Google Forms
- ☕ Tip Jar entry for Polar Checkout Links
- 📱 PWA support for Add to Home Screen

## 🛠️ Stack

- Next.js 14
- Mapbox GL JS
- Framer Motion
- Lucide React
- Nunito + Fredoka

## 🚀 Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## 🔧 Optional Setup

### Google Form Feedback

Current form:

```bash
NEXT_PUBLIC_GOOGLE_FORM_ID=1FAIpQLScaibUcLsfuTPkf3pInp307F5qqwWEV6uYeQecCjihRb5dZmQ
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_TYPE=entry.1342373517
NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE=entry.599050854
```

### Polar Tip Jar

Use one Pay What You Want checkout link:

```bash
NEXT_PUBLIC_POLAR_TIP_LINK=https://polar.sh/...
```

Or use separate checkout links for each amount:

```bash
NEXT_PUBLIC_POLAR_TIP_RM_5_LINK=https://polar.sh/...
NEXT_PUBLIC_POLAR_TIP_RM_15_LINK=https://polar.sh/...
NEXT_PUBLIC_POLAR_TIP_RM_30_LINK=https://polar.sh/...
```

## 📊 Validation Goals

- 30+ real visitors
- 5+ useful feedback responses
- 3+ home screen installs

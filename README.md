****# Bomach Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: Private](https://img.shields.io/badge/License-Private-red.svg)](LICENSE)

A high-performance, responsive, and visually stunning corporate website for **Bomach Group**, built with modern web technologies including Next.js 16, React 19, and Framer Motion.

## 🚀 Overview

Bomach Frontend is a comprehensive web application designed to showcase the diverse business sectors of the Bomach Group. From real estate and properties to career opportunities and corporate services, the platform provides a seamless user experience with dynamic animations and interactive components.

## ✨ Key Features

- **🏢 Property Management**: Browse featured and all properties with advanced filtering (city, category, state).
- **🏗️ Project Showcase**: Detailed view of ongoing and completed projects with high-quality media.
- **💼 Career Portal**: Integrated job board with application forms and management.
- **📦 Product Catalog**: Display of corporate products and inventory.
- **📰 Corporate Blog**: News, updates, and articles with a rich-text experience.
- **📈 Management Dashboard**: Dedicated admin area for content management.
- **🗺️ Interactive Maps**: Leaflet-powered maps for location-based services.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **🔄 Hybrid Data Strategy**: Robust API layer with static data fallback for high availability.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **State & Logic**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Swiper](https://swiperjs.com/) (Carousels), [Leaflet](https://leafletjs.org/) (Maps)
- **Animations**: Framer Motion for premium micro-interactions.

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bomachgroup/bomach-frontend.git
   cd bomach-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the necessary variables:
   ```env
   NEXT_PUBLIC_API_URL=https://backend.bomachgroup.com/api
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
src/
├── app/          # Next.js App Router (Pages, Layouts, APIs)
├── components/   # Reusable UI components
├── contexts/     # React Contexts for global state
├── hooks/        # Custom React hooks
├── lib/          # API layer, data normalization, and utilities
└── styles/       # Global styles and Tailwind configurations
```

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## 🛡️ License

This project is private and proprietary to Bomach Group. All rights reserved.

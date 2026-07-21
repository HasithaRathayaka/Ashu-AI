# Ashu.ai - Full-Stack MERN Generative AI SaaS Platform

**Ashu.ai** is a modern, high-performance MERN-stack AI SaaS application delivering multi-modal content creation tools (Article Writing, Blog Headlines, Image Generation, Resume Analysis, Background Removal, Object Removal) with an ultra-sleek dark-mode workspace.

---

## 🌟 Key Features

- **SEO Article Writer**: Long-form structured article generator powered by Google Gemini AI.
- **Blog Headlines Generator**: Viral headline generator with category customization.
- **AI Image Generator**: Photorealistic AI art & visual generation via Clipdrop & Cloudinary.
- **Background Remover**: Instant background removal uploading isolated transparent PNGs to Cloudinary.
- **Object Eraser**: Inpainting tool for smart object removal.
- **Resume Audit & Critique**: PDF parsing and ATS compliance scoring via Gemini AI.
- **Authentication Gate**: Mandatory user sign-in via Clerk (`@clerk/clerk-react`).
- **Community Feed & Gallery**: Public creation gallery with interactive heart like counters.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- React 19 + Vite 6
- Tailwind CSS v4 (Dark Theme Palette)
- Lucide Icons & Framer Motion
- React Router v7 & React Markdown
- `@clerk/clerk-react`

### Backend (`/server`)
- Node.js (ES Modules) + Express.js
- MongoDB Atlas + Mongoose ORM
- Google Gemini API (`@google/generative-ai`)
- Clipdrop API & Cloudinary SDK
- Multer & PDF-Parse
- `@clerk/express`

---

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` to `server/.env` and add your credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Install & Run Locally

```bash
# Install root dependencies
npm install

# Run client & server concurrently
npm run dev
```

The application will be accessible at:
- **Frontend Studio**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📄 License
MIT License. Created for Ashu.ai Platform.

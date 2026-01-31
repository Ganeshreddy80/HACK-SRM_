# 🛡️ AI Content Guard - Deepfake Detection Platform

> **A premium, investigation-grade dashboard to detect AI-generated Images, Videos, and Audio.**  
> *Built for HACK-SRM*

## 🚀 Overview

AI Content Guard is a full-stack investigative tool designed to help users identify synthetic media. In an era of deepfakes, this tool provides a simple, "Apple-style" premium interface to forensic AI models, allowing users to verify the authenticity of digital content instantly.

![Dashboard Preview](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2600&ixlib=rb-4.0.3) 
*(Example Dashboard Layout)*

## ✨ Key Features

- **🖼️ Multi-Modal Analysis**:
  - **Images**: Detects AI artifacts in JPG, PNG, WEBP (powered by SightEngine).
  - **Videos**: Smart polling for deepfake face-swaps and lip-sync anomalies.
  - **Audio**: Industry-grade voice cloning detection (powered by **Hive AI**).
  - **URLs**: Analyze content directly via links without downloading.

- **💎 Premium UI/UX**:
  - Built with **React + Tailwind CSS**.
  - Glassmorphism effects, smooth transitions, and intuitive design.
  - Interactive "About Project" modal for academic context.

- **🔐 Secure Authentication**:
  - Full Login & Signup flow.
  - Protected Dashboard routes (React Router).
  - Persistent user sessions.

- **⚡ Real-Time Feedback**:
  - Interactive file uploads (Drag & Drop).
  - Smart polling for async video results.
  - Live progress indicators.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS / PostCSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Backend
- **Server**: Python (FastAPI)
- **AI Integrations**:
  - **Hive AI** (Audio Forensics)
  - **SightEngine** (Visual Forensics)
- **Networking**: Uvicorn, Request Polling

## ⚙️ Installation & Setup

### 1. Backend (Python)
Navigate to the root directory and start the server:
```bash
# Install dependencies (if not already installed)
pip install fastapi uvicorn requests python-multipart

# Run the server
python3 main.py
```
*Server runs at: `http://127.0.0.1:8000`*

### 2. Frontend (React)
Open a new terminal, navigate to the `frontend` folder, and start the UI:
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev -- --host
```
*App runs at: `http://localhost:5173`*

## 📖 Usage Guide

1.  **Sign Up/Login**: Create an account to access the dashboard.
2.  **Select Media Type**: Choose Image, Video, or Audio analysis.
3.  **Upload or Paste Link**: Drag a file or paste a URL.
4.  **View Results**: Get an instant probability score (0% - 100% AI).
5.  **About**: Click the "Info" icon in the navbar to read the project mission.

---
*Created for Educational Purposes • HACK-SRM*

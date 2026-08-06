# SwasthGram – Rural Healthcare Disease Prediction System

**SwasthGram** is a web-based rural healthcare platform designed to help people in remote areas perform preliminary disease risk assessments based on symptoms, locate nearby hospitals, access emergency contacts, and receive health guidance in their preferred language.

Built with **React, TypeScript, Vite, Tailwind CSS, and Supabase**, the application aims to bridge the healthcare accessibility gap by providing simple, fast, and user-friendly digital health assistance.

## Overview

Healthcare accessibility remains a major challenge in many rural communities. People often struggle to identify the seriousness of their symptoms or locate appropriate healthcare facilities in time.
SwasthGram addresses these challenges by providing:
- Preliminary symptom-based disease prediction
- Nearby hospital discovery
- Emergency healthcare support
- Personal health dashboard
- Government health scheme information
- Multilingual support
- Voice-assisted symptom input

> **Disclaimer:** SwasthGram provides a preliminary health risk assessment and is **not** a replacement for professional medical diagnosis.

# Features

## Disease Prediction
- Symptom-based disease prediction
- Rule-based prediction engine
- Risk assessment (Low / High)
- Suggested medicines
- Home remedies
- Prevention tips
- Medical advice
- Emergency warning for critical symptoms
- Downloadable health report
- Printable report

## Voice Input
- Speech recognition for symptom entry
- Helps users with low literacy
- Faster symptom reporting

## Nearby Hospital Finder
- Search nearby hospitals
- Government & Private hospitals
- Geolocation support
- Distance calculation
- Emergency availability
- 24×7 hospital information
- Direct phone call option
- Google Maps directions
- Filter by
  - State
  - Hospital Type
- Search hospitals instantly

## Emergency Support
- One-click **108 Ambulance**
- Emergency symptom alerts
- Immediate hospital recommendation
- High-risk notifications

## User Authentication
- Secure Sign Up
- Login
- Forgot Password
- Supabase Authentication
- Session Management

## Personal Dashboard
Registered users can:
- View prediction history
- Delete previous reports
- Access emergency contacts
- View government health schemes
- Read daily health tips
- Track previous assessments

## Admin Panel
Admin users can manage:
- Hospitals
- Diseases
- User Reports

Includes:
- Add Hospital
- Delete Hospital
- Add Disease
- Delete Disease
- View Prediction Reports

## Multi-language Support
Supports:
- 🇬🇧 English
- 🇮🇳 Hindi
- 🇮🇳 Telugu
Making healthcare more accessible for rural users.

## User Experience
- Responsive Design
- Dark Mode
- Light Mode
- Modern UI
- Mobile Friendly
- Beautiful Animations
- Accessible Design

# Tech Stack
### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
### Backend
- Supabase
### Database
- PostgreSQL (Supabase)
### Authentication
- Supabase Authentication
### APIs & Browser Features
- Geolocation API
- Web Speech API
- Local Storage
### Icons
- Lucide React

# Project Structure
```text
SwasthGram/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Predict.tsx
│   │   ├── Hospitals.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Admin.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Auth.tsx
│   │
│   ├── lib/
│   │   ├── context.tsx
│   │   ├── router.ts
│   │   ├── prediction.ts
│   │   ├── supabase.ts
│   │   └── i18n.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

# Getting Started

## Clone the Repository
```bash
git clone https://github.com/MahaChamarty/SwasthGram.git
```
## Navigate to Project
```bash
cd SwasthGram
```
## Install Dependencies
```bash
npm install
```
## Configure Environment Variables
Create a `.env` file.
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```
## Run the Project
```bash
npm run dev
```
The application will start on
```
http://localhost:5173
```

# Application Workflow

```text
User
↓
Home Page
↓
Disease Prediction
↓
Enter Symptoms
OR
Voice Input
↓
Risk Assessment
↓
Receive
• Disease Prediction
• Medicines
• Home Remedies
• Prevention Tips
• Medical Advice
↓
If High Risk
↓
Nearby Hospitals
↓
Call Ambulance (108)
↓
Save Report
↓
Dashboard
```

# Future Enhancements
- AI/ML-based Disease Prediction
- Appointment Booking
- Video Consultation
- Live Doctor Chat
- Electronic Health Records
- Medicine Availability
- Blood Bank Locator
- Offline Support (PWA)
- Push Notifications
- Health Analytics
- Wearable Device Integration

# Learning Outcomes
This project helped us gain practical experience in:
- React Development
- TypeScript
- Tailwind CSS
- Supabase Integration
- Authentication
- CRUD Operations
- State Management
- Responsive UI Design
- Geolocation API
- Speech Recognition API
- Role-Based Access Control
- Healthcare Application Development
- Team Collaboration
- Git & GitHub

# Team
This project was developed collaboratively as part of a team project focused on improving rural healthcare accessibility through technology.
Each team member contributed to different aspects of:
- UI/UX Design
- Frontend Development
- Backend Integration
- Database Design
- Authentication
- Disease Prediction Logic
- Hospital Management
- Testing
- Documentation

# Author

**Sri Mahalakshmi Chamarty**

B.Tech – Computer Science Engineering (AI & DS)

GitHub: https://github.com/MahaChamarty


# Acknowledgements
We sincerely thank our faculty mentors and institution for their continuous guidance throughout this project. We are also grateful to the rural communities whose real-world challenges inspired the development of SwasthGram. Their experiences motivated us to design a solution that aims to improve healthcare accessibility through technology.

# ⭐ Support

If you found this project helpful or interesting, please consider giving it a **⭐ Star** on GitHub. Your support encourages us to continue building impactful projects.

🌐 Online Leave Application System

A modern web-based leave management system built with Next.js, Supabase, and Vercel.

<p align="center"> <img src="https://img.shields.io/badge/Framework-Next.js-black" /> <img src="https://img.shields.io/badge/Database-Supabase-3FCF8E" /> <img src="https://img.shields.io/badge/Deployment-Vercel-000000" /> <img src="https://img.shields.io/badge/Language-JavaScript-blue" /> <img src="https://img.shields.io/badge/Status-Active-brightgreen" /> </p>
📌 Overview

The Online Leave Application System is a full-stack web application designed to simplify the process of submitting, reviewing, tracking, and managing leave requests within an institution.

Built using Next.js, Supabase, and Tailwind CSS, the project provides:

A simple interface for students to submit leave applications

A clean admin panel for approving or rejecting requests

A fully cloud-hosted experience (Vercel + Supabase)

Secure authentication with email domain restriction

Persistent login sessions (no auto-logout)

🚀 Features
Student Features

Sign-up & log in (email must end with @vitstudent.ac.in)

No email verification required

Submit leave applications

View leave request history

Track leave status (Pending / Approved / Rejected)

Manual logout (no session timeout)

Admin Features

Login using pre-defined admin account:

Email: admin@vitc.ac.in

Password: admin

View all pending leave requests

Approve or reject requests with comments

View all student leave histories

🔐 Authentication Rules

✔ Only emails ending with @vitstudent.ac.in can sign up
✔ Admin email is manually created and bypasses domain restriction
✔ No email verification required
✔ Sessions never expire automatically
✔ Users stay logged in until manually logged out

📁 Tech Stack
Frontend

Next.js 14

React

Tailwind CSS

Backend / Database

Supabase Authentication

Supabase PostgreSQL

Supabase Policies & Edge Functions (optional)

Deployment

Vercel (CI/CD via GitHub)

Version Control

GitHub

🧩 System Architecture
flowchart LR
    User([Student User]) --> Frontend[Next.js Frontend]
    Frontend --> Auth[Supabase Auth]
    Auth --> DB[(Supabase Database)]
    Admin([Admin User]) --> Frontend
    Frontend --> DB

📐 Design Documents
✔ System Architecture
✔ System Design
✔ SRS (Software Requirement Specification)
✔ DFD (Data Flow Diagram)
✔ ERD (Entity Relationship Diagram)
✔ UML Diagrams

Use Case Diagram

Class Diagram

Sequence Diagram (Apply Leave + Approve Leave)

Activity Diagram

All diagrams included in /docs folder (or add your links here).

🧪 Testing

This project includes:

Integration Testing

Login → Apply → DB insert → Status display

Regression Testing

Re-run tests after new features (approval workflow, domain validation)

Mutation Testing

Invalid inputs

Empty reason

Wrong date order

Screenshots

Add your actual screenshots here:

/screenshots/integration_test.png
/screenshots/regression_test.png
/screenshots/mutation_test.png

🛠️ Installation & Setup

Clone the project:

git clone https://github.com/yourusername/leave-application-system.git
cd leave-application-system


Install dependencies:

npm install


Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY


Run the project:

npm run dev


Deploy to Vercel:

vercel

📦 Folder Structure
project/
│── app/
│   ├── login/
│   ├── signup/
│   ├── dashboard/
│   ├── admin/
│   ├── api/
│── components/
│── lib/
│── docs/
│── screenshots/
│── README.md

📸 Screenshots

Add your project UI screenshots:

Login Page

Signup Page

User Dashboard

Apply Leave Screen

Leave History

Admin Pending Requests

Approve/Reject Screen

🎥 Project Demo

👉 Add your demo video link here once recorded
(e.g., YouTube, Google Drive, Loom)

📚 Project Report (DA3 PDF)

Your full project report is included in:

/docs/DA3_Project_Report.pdf


It includes:

Problem Statement

User Stories

Architecture & Design

Test Cases

SRS

DFD

ERD

UML

GitHub Link

👨‍💻 Author

Ritvic Vijay
23BCE1800
Vellore Institute of Technology

⭐ Show Support

If you found this project useful, consider giving the repo a star ⭐ on GitHub!

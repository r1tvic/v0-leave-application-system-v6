<span style="font-size:32px; font-weight:700;">🌐 Online Leave Application System</span>

A modern web-based leave management system built using Next.js, Supabase, and Vercel.

<p align="center"> <img src="https://img.shields.io/badge/Framework-Next.js-black" /> <img src="https://img.shields.io/badge/Database-Supabase-3FCF8E" /> <img src="https://img.shields.io/badge/Deployment-Vercel-000000" /> <img src="https://img.shields.io/badge/Language-JavaScript-blue" /> <img src="https://img.shields.io/badge/Status-Active-brightgreen" /> </p>
<span style="font-size:26px; font-weight:700;">📌 Overview</span>

The Online Leave Application System simplifies the process of submitting, reviewing, and managing leave requests in an institution.

It offers:

📄 Student leave submission

🔍 Tracking leave status

🛠 Admin approval workflow

🔐 Authentication with domain restriction

🌐 Cloud deployment via Vercel

💾 Supabase Auth + Database

<span style="font-size:26px; font-weight:700;">🚀 Features</span>
<span style="font-size:22px; font-weight:700;">Student Features</span>

Sign-up & Login using @vitstudent.ac.in

No email verification required

Submit leave applications

View leave request history

Track status (Pending / Approved / Rejected)

Manual logout (session never expires automatically)

<span style="font-size:22px; font-weight:700;">Admin Features</span>

Predefined admin credentials:
Email: admin@vitc.ac.in
Password: admin

View all pending leave requests

Approve / Reject requests with comments

Access all student leave histories

<span style="font-size:26px; font-weight:700;">🔐 Authentication Rules</span>

✔ Only emails ending with @vitstudent.ac.in can create accounts

✔ Admin login uses a predefined, manually created account

✔ No email verification required

✔ No auto-logout (session persistent until manual logout)

✔ Secure password-based login via Supabase Auth

<span style="font-size:26px; font-weight:700;">📁 Tech Stack</span>
<span style="font-size:22px; font-weight:700;">Frontend</span>

Next.js 14

React

Tailwind CSS

<span style="font-size:22px; font-weight:700;">Backend / Database</span>

Supabase Authentication

Supabase PostgreSQL

Optional: Supabase Edge Functions

<span style="font-size:22px; font-weight:700;">Deployment</span>

Vercel (CI/CD via GitHub)

<span style="font-size:22px; font-weight:700;">Version Control</span>

GitHub

<span style="font-size:26px; font-weight:700;">🧩 System Architecture</span>
flowchart LR
    User([Student User]) --> Frontend[Next.js Frontend]
    Frontend --> Auth[Supabase Auth]
    Auth --> DB[(Supabase Database)]
    Admin([Admin User]) --> Frontend
    Frontend --> DB

<span style="font-size:26px; font-weight:700;">📐 Design Documents</span>

All design diagrams are included in the /docs folder:

✔ System Architecture

✔ System Design

✔ SRS

✔ DFD

✔ ERD

✔ UML Diagrams

Use Case

Class

Sequence

Activity

<span style="font-size:26px; font-weight:700;">🧪 Testing</span>
<span style="font-size:22px; font-weight:700;">💡 Integration Testing</span>

End-to-end validation of:

Login → Apply → DB Insert → Status Update

<span style="font-size:22px; font-weight:700;">♻ Regression Testing</span>

Ensuring no existing functionality breaks after updates.

<span style="font-size:22px; font-weight:700;">🧬 Mutation Testing</span>

Testing system behavior under invalid/mutated inputs.

<span style="font-size:22px; font-weight:700;">📸 Test Screenshots</span>

Add your screenshots in:

/screenshots/integration_test.png
/screenshots/regression_test.png
/screenshots/mutation_test.png

<span style="font-size:26px; font-weight:700;">🛠️ Installation & Setup</span>
<span style="font-size:22px; font-weight:700;">Clone the repository</span>
git clone https://github.com/yourusername/leave-application-system.git
cd leave-application-system

<span style="font-size:22px; font-weight:700;">Install dependencies</span>
npm install

<span style="font-size:22px; font-weight:700;">Environment variables</span>

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

<span style="font-size:22px; font-weight:700;">Run the project</span>
npm run dev

<span style="font-size:22px; font-weight:700;">Deploy to Vercel</span>
vercel

<span style="font-size:26px; font-weight:700;">📦 Folder Structure</span>
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

<span style="font-size:26px; font-weight:700;">📸 Screenshots</span>

Add your images:

Login Page

Signup Page

User Dashboard

Apply Leave Form

Leave History

Admin Pending Requests

Approve / Reject Screens

<span style="font-size:26px; font-weight:700;">🎥 Project Demo</span>

📌 Add your video demo link here (YouTube, Drive, or Loom)

<span style="font-size:26px; font-weight:700;">📚 Project Report (DA3 PDF)</span>

Your full project report is included in:

/docs/DA3_Project_Report.pdf


Includes:

Problem Statement

User Stories

Architecture & System Design

Test Plan

SRS

DFD

ERD

UML

GitHub Link

<span style="font-size:26px; font-weight:700;">👨‍💻 Author</span>

Ritvic Vijay
23BCE1800
Vellore Institute of Technology

<span style="font-size:26px; font-weight:700;">⭐ Support</span>

If you found this project useful, please consider starring ⭐ the repo on GitHub!

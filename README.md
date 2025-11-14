# Online Leave Application System

A full-stack web application built using Next.js, Supabase, and Vercel for managing student leave requests with admin approval features.

GitHub Repository:  
https://github.com/r1tvic/v0-leave-application-system-v6

---

## 📌 Overview

The Online Leave Application System streamlines the process of submitting, approving, managing, and tracking leave requests inside an institution.

Key Highlights:
- Student leave application  
- Admin approval workflow  
- Domain-restricted authentication  
- Persistent login sessions (no auto logout)  
- Cloud deployment via Vercel + Supabase  

---

## 🚀 Features

### Student Features
- Sign-up & login using **@vitstudent.ac.in**
- **No email verification required**
- Apply for leave
- View leave status (Pending / Approved / Rejected)
- View complete leave history
- Manual logout (session never expires)

### Admin Features
- Login using predefined credentials:  
  - Email: **admin@vitc.ac.in**  
  - Password: **admin**
- View all pending leave requests
- Approve or reject with comments
- View complete leave history for all users

---

## 🔐 Authentication Rules

- Only **@vitstudent.ac.in** emails may sign up  
- Admin account is predefined  
- No email verification required  
- No session timeout — manual logout only  
- Supabase Auth manages authentication & session storage  

---

## 🛠 Tech Stack

### Frontend
- Next.js 14  
- React  
- Tailwind CSS  

### Backend
- Supabase Authentication  
- Supabase PostgreSQL Database  
- (Optional) Supabase Edge Functions  

### Deployment
- Vercel (Automatic deployment via GitHub)

### Version Control
- GitHub: https://github.com/r1tvic/v0-leave-application-system-v6

---

## 🧩 System Architecture

*(Insert architecture image if available)*  
Example:

yaml
Copy code

---

## 📐 Design Documents

Stored inside `/docs`:

- System Architecture  
- System Design  
- Software Requirements Specification (SRS)  
- Data Flow Diagram (DFD)  
- Entity Relationship Diagram (ERD)  
- UML Diagrams  
  - Use Case  
  - Class  
  - Activity  
  - Sequence  

---

## 🧪 Testing

### Integration Testing
- Login → Apply → DB insert → Status update  

### Regression Testing
- Ensuring system stability after new updates  

### Mutation Testing
- Invalid input handling  
- Empty fields  
- Incorrect date ranges  
- Unauthorized admin route access  

Testing screenshots stored inside:

/screenshots/integration_test.png
/screenshots/regression_test.png
/screenshots/mutation_test.png

yaml
Copy code

---

## 🛠 Installation & Setup

### 1. Clone the Repository
git clone https://github.com/r1tvic/v0-leave-application-system-v6
cd v0-leave-application-system-v6

shell
Copy code

### 2. Install Dependencies
npm install

shell
Copy code

### 3. Create `.env.local`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

shell
Copy code

### 4. Start Development Server
npm run dev

shell
Copy code

### 5. Deploy to Vercel
vercel

yaml
Copy code

---

## 📂 Folder Structure

project/
│── app/
│ ├── login/
│ ├── signup/
│ ├── dashboard/
│ ├── admin/
│ ├── api/
│── components/
│── lib/
│── docs/
│── screenshots/
│── public/
│── README.md

yaml
Copy code

---

## 📸 Screenshots

Place screenshots in `/screenshots/`:

- Login Page  
- Signup Page  
- User Dashboard  
- Apply Leave Page  
- Leave History  
- Admin Panel  
- Approve / Reject Page  

---

## 🎥 Project Demo

Add your demo link here:

https://your-demo-link.com

yaml
Copy code

---

## 📚 DA3 Project Report

Store your final PDF here:

/docs/DA3_Project_Report.pdf

yaml
Copy code

Report includes:
- Problem Statement  
- User Stories  
- System Architecture  
- Test Plans  
- SRS  
- DFD  
- ERD  
- UML Diagrams  
- GitHub Repository Link  

---

## 👤 Author

**Ritvic Vijay**  
23BCE1800  
Vellore Institute of Technology  

---

## ⭐ Support

If this project helped you, please star ⭐ the repository!

GitHub: https://github.com/r1tvic/v0-leave-application-system-v6

📧 Email Scheduler

A modern full-stack Email Scheduler application that allows users to schedule single or bulk emails, upload recipient lists through CSV, manage email queues, and monitor email delivery status using a responsive dashboard.
Features
-  Schedule Single Emails
-  Bulk Email Scheduling using CSV Upload
-  Custom Email Scheduling
-  Background Email Processing with BullMQ
-  Dashboard with Email Statistics
-  Scheduled Emails Management
-  Sent Emails History
-  Search Emails by Recipient or Subject
-  Real SMTP Email Delivery
-  Hourly Rate Limiting
-  Modern Responsive UI

 Tech Stack

Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- BullMQ
- Nodemailer
- Multer
  
Project Structure

email-scheduler
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   ├── prisma
│   ├── uploads
│   └── package.json
│
└── README.md

Installation

Clone Repository

```bash
git clone https://github.com/harshavardan17/Email_Scheduler.git
```

```bash
cd Email_Scheduler
```
Configure environment variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=your_database_url

REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

DEFAULT_DELAY=2000
MAX_EMAILS_PER_HOUR=200
WORKER_CONCURRENCY=5
```

Run backend

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Application Features

- Dashboard Overview
- Compose Email
- Upload CSV
- Scheduled Email List
- Sent Email List
- Email Queue Processing
- Dashboard Statistics
- Search Functionality
- Responsive Design

 Workflow

1. Compose a single email or upload a CSV.
2. Schedule emails for future delivery.
3. Jobs are added to BullMQ.
4. Worker processes jobs using Redis.
5. Emails are sent through SMTP.
6. Status updates are stored in PostgreSQL.
7. Dashboard reflects scheduled and sent emails.
   
Future Enhancements

- JWT Authentication
- Email Templates
- Analytics Dashboard
- Docker Support
- Deployment on Render & Vercel
- SendGrid/Mailgun Integration
- CSV Upload History

Author
Harsha Vardan Reddy

GitHub: https://github.com/harshavardan17

# 📁 DriveBox – Google Drive Clone (Clerk + AWS S3)

Welcome to **DriveBox** – a sleek, minimal, and secure Google Drive alternative. Built using **vanilla JavaScript**, **Clerk authentication**, and **AWS S3** for cloud storage. No frameworks. No fluff. Just raw modern web power. 🚀



---

## 🔥 Features

- 🔐 **User Authentication** with [Clerk.dev](https://clerk.dev)
- ☁️ **Secure File Storage** on AWS S3 using presigned URLs
- 📂 Create, rename, and delete folders
- 📄 Upload, preview, rename, and delete files
- 🛡️ Auth-protected UI – each user gets their own DriveBox space
- 💡 Built with 100% **HTML, CSS, and Vanilla JS**

---

---

## 🧰 Tech Stack

| Layer       | Tech                      |
|------------|---------------------------|
| Frontend   | HTML, CSS, JavaScript     |
| Auth       | Clerk                     |
| Storage    | AWS S3                    |
| Hosting    | (Vercel / Netlify / Local)|
| Architecture | Serverless-ready        |

---

## 🛠️ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/Shlokmonster/DriveBox-Google-Drive-Clone.git
cd DriveBox-Google-Drive-Clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your_bucket_name
```

> Note: Make sure your AWS IAM user has permission for `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject`.

### 4. Run the App Locally

```bash
npm run dev
```

---

## 💡 Roadmap

- [ ] File sharing via links
- [ ] File versioning
- [ ] Drag-and-drop file upload
- [ ] User storage limits

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you want to change. Make sure your code is clean and documented.

---

## 📄 License

MIT License – do what you want, just don't forget to credit if you fork it like crazy.

---

## 👋 Shoutout

Made with 💻, ☕, and too many re-runs of Silicon Valley by [@Shlokmonster](https://github.com/Shlokmonster)

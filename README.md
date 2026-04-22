# 🛡️ CyberVision – AI-Powered Web Application Penetration Testing System

CyberVision is an intelligent web application security assessment platform that leverages **AI + automated scanning techniques** to identify vulnerabilities, analyze risks, and generate detailed security reports.

This project combines **modern web technologies** with **cybersecurity automation** to simulate real-world penetration testing workflows.

---

## 🚀 Features

* 🔍 **Automated Vulnerability Scanning**

  * Parameter discovery using wordlists
  * Endpoint analysis
  * Basic security misconfiguration detection

* 🤖 **AI-Powered Analysis**

  * Smart vulnerability interpretation
  * Automated report generation (planned/improvable)

* 📊 **Interactive Dashboard**

  * Modern UI built with React
  * Real-time scan visualization

* 🧠 **Multi-Stage Testing Flow**

  * Target input → Recon → Scan → Analysis → Report

* 🗄️ **Database Integration**

  * MongoDB for storing scan results and targets

---

## 🏗️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios

### Backend

* FastAPI (Python)
* Uvicorn
* PyMongo

### Database

* MongoDB (Local / Atlas)

---

## 📁 Project Structure

```
cyberV/
│
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── db/
│   │   │   └── mongo.py     # MongoDB connection
│   │   ├── wordlists/       # Scanning wordlists
│   │
│   └── venv/
│
├── cyber-frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React app
│   │
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AyubKureshi/cyberV.git
cd cyberV
```

---

## 🔧 Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
```

### Activate Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

*(If requirements.txt not available)*

```bash
pip install fastapi uvicorn pymongo python-dotenv
```

---

### Create `.env` file (backend)

```
MONGODB_URI=your_mongodb_connection_string
```

---

### Run Backend

```bash
uvicorn app.main:app --reload
```

👉 Backend runs on:
`http://127.0.0.1:8000`

---

## 🎨 Frontend Setup (React)

```bash
cd cyber-frontend
npm install
```

### Run Frontend

```bash
npm run dev
```

👉 Frontend runs on:
`http://localhost:5173`

---

## 🔗 Connecting Frontend & Backend

Create `.env` in frontend:

```
VITE_API_URL=http://localhost:8000
```

---

## 🧪 How It Works

1. User enters target URL
2. Backend performs:

   * Reconnaissance
   * Parameter discovery
   * Endpoint scanning
3. Results are processed
4. Data stored in MongoDB
5. Frontend displays results
6. (Optional) AI generates report

---

## 📸 Screenshots (Add here)

* Dashboard UI
* Scan Results
* Report Page

---

## 🎯 Future Improvements

* 🔥 AI-based vulnerability classification
* 📄 Automated PDF report generation
* ⚡ Parallel scanning (multi-agent style)
* 🧠 Integration with LLM APIs (Gemini / OpenAI / SambaNova)
* 🔐 Advanced vulnerability detection (SQLi, XSS, SSRF)

---

## ⚠️ Disclaimer

This tool is developed **for educational and ethical purposes only**.
Do NOT use it on unauthorized systems.

---

## 👨‍💻 Author

**Ayub Kureshi**

* 🎓 Sinhgad College of Engineering
* 💡 AI + Cybersecurity Enthusiast

---

## ⭐ Support

If you like this project:

* Star ⭐ the repo
* Share with others
* Contribute improvements

---

## 📜 License

This project is open-source and available under the MIT License.

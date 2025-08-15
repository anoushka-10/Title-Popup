# 🚀 LinkedIn Profile Scraper & Data Pipeline

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image1.png" alt="Extension UI" width="370"/>
</p>

A powerful Chrome extension that automates the collection of public data from LinkedIn profiles. This tool provides a full end-to-end data pipeline, from a user-friendly interface to a robust backend that intelligently saves scraped information into a structured database.

---

## ✨ Key Features & Workflow

The extension provides a seamless, automated workflow for data collection, broken down into three simple steps.

### 1. Input URLs & Start Scraping
The user provides a list of LinkedIn profile URLs and initiates the process with a single click from the clean, intuitive UI.

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image1.png" alt="Extension UI" width="400"/>
</p>

### 2. Automated Browser Actions
The extension systematically opens, scrapes, and closes each profile in the background, providing real-time progress updates.

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image3.png" alt="Running Extension" width="400"/>
</p>

### 3. View Structured Data
The extracted data is saved into a structured SQLite database, which can be easily viewed and exported.

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image2.png" alt="Database View" width="600"/>
</p>

-   **Bulk Profile Processing**: Scrape multiple profiles in a single batch operation.
-   **Resilient Data Extraction**: Employs an array of fallback CSS selectors to ensure data is captured correctly even if LinkedIn's UI changes.
-   **Intelligent Database Operations**: The backend API uses an "upsert" logic—updating existing profiles and creating new ones—to prevent duplicates and keep data current.
-   **Real-Time Feedback**: The UI provides live progress updates, status messages, and success confirmations.
-   **Data Points Collected**: Full Name, Location, Bio/Headline, About Section, Follower Count, and Connection Count.

---

## 🛠️ Technology Stack

This project leverages a modern, full-stack JavaScript architecture.

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome"/>
</p>

---

## ⚙️ Setup and Installation

To run this project, you need to set up both the backend server and the Chrome extension.

### 1. Backend Server

**Prerequisites:**
-   [Node.js](https://nodejs.org/) (v14 or higher)

**Instructions:**
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/anoushka-10/Title-Popup.git](https://github.com/anoushka-10/Title-Popup.git)
    ```
2.  **Navigate to the server directory:**
    ```bash
    cd Title-Popup/backend 
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the server:**
    ```bash
    node server.js
    ```
    > The server will start on `http://localhost:3000`. Keep this terminal running.

### 2. Chrome Extension

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** in the top-right corner.
3.  Click **Load unpacked**.
4.  Select the root folder containing the extension's files (`manifest.json`, `popup.html`, etc.).
5.  The extension will now be active in your browser toolbar.

---

## 🏗️ System Architecture

The project operates on a three-part architecture that creates a complete data pipeline:

1.  **Extension UI (`popup.js`)**: The command center. It manages the user interface, controls the scraping loop, and orchestrates the entire workflow.
2.  **Injected Scraper (`scrapeLinkedInProfile`)**: A dynamic and robust JavaScript function that is injected directly onto the LinkedIn profile page. It is responsible for all data extraction from the live DOM.
3.  **Backend API (`server.js`)**: A Node.js and Express server that exposes a `POST /api/profiles` endpoint. It receives data from the extension and uses Sequelize to intelligently save it to the SQLite database.

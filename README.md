# 🚀 LinkedIn Automation Suite - Profile Scraper & Feed Interaction

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image1.png" alt="Extension UI" width="370"/>
    <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image4.png" alt="Feed Interaction Mode" width="370"/>

</p>

A comprehensive Chrome extension that automates LinkedIn interactions with two powerful modes: **Profile Scraping** for data collection and **Feed Interaction** for automated engagement. This tool provides a complete automation pipeline with an intuitive interface and robust backend infrastructure.

---

## ✨ Dual-Mode Features

### 🔍 **Mode 1: Profile Scraper**
Automated bulk collection of public LinkedIn profile data with intelligent data pipeline integration.

### ⚡ **Mode 2: Feed Interaction** 
Smart LinkedIn feed automation that performs human-like interactions including likes and comments.

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image4.png" alt="Feed Interaction Mode" width="400"/>
</p>

---

## 🎯 Complete Workflow

### **Profile Scraper Workflow**

#### 1. Input URLs & Start Scraping
The user provides a list of LinkedIn profile URLs and initiates the process with a single click from the clean, intuitive UI.

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image1.png" alt="Extension UI" width="400"/>
</p>

#### 2. Automated Browser Actions
The extension systematically opens, scrapes, and closes each profile in the background, providing real-time progress updates.

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image3.png" alt="Running Extension" width="400"/>
</p>

#### 3. View Structured Data
The extracted data is saved into a structured SQLite database, which can be easily viewed and exported.

<p align="center">
  <img src="https://raw.githubusercontent.com/anoushka-10/Title-Popup/main/images/image2.png" alt="Database View" width="600"/>
</p>

### **Feed Interaction Workflow**

#### 1. Configure Interaction Settings
Set the number of posts to like and comment on through the intuitive interface.

#### 2. Automated Feed Engagement
The extension navigates to LinkedIn feed and performs human-like interactions:
- **Smart Post Detection**: Identifies and randomly selects posts
- **Realistic Interactions**: Likes posts with natural timing
- **Generic Commenting**: Posts "CFBR" comments automatically
- **Progress Tracking**: Real-time updates on completed actions

#### 3. Human-like Behavior
- Random delays between actions (1-4 seconds)
- Smooth scrolling to load more content
- Realistic mouse events and typing patterns
- Avoids already-liked posts and duplicate interactions

---

## 🚀 Advanced Features

### **Profile Scraper Capabilities**
-   **Bulk Profile Processing**: Scrape multiple profiles in a single batch operation
-   **Resilient Data Extraction**: Employs an array of fallback CSS selectors to ensure data is captured correctly even if LinkedIn's UI changes
-   **Intelligent Database Operations**: The backend API uses "upsert" logic—updating existing profiles and creating new ones—to prevent duplicates and keep data current
-   **Data Points Collected**: Full Name, Location, Bio/Headline, About Section, Follower Count, and Connection Count

### **Feed Interaction Capabilities**
-   **Configurable Automation**: Set custom like and comment targets (1-50 likes, 1-20 comments)
-   **Smart Post Selection**: Randomly selects posts from the current feed view
-   **Duplicate Prevention**: Tracks processed posts to avoid repeat interactions
-   **Human-like Timing**: Implements realistic delays and interaction patterns
-   **Auto-navigation**: Automatically navigates to LinkedIn feed if needed
-   **Real-time Progress**: Live updates showing likes/comments completed

### **Universal Features**
-   **Real-Time Feedback**: Both modes provide live progress updates, status messages, and success confirmations
-   **Error Handling**: Robust error management with user-friendly messages
-   **LinkedIn Detection**: Automatically detects LinkedIn pages and provides guidance
-   **Dual Interface**: Clean mode switching between scraper and interaction functionalities

---

## 🛠️ Technology Stack

This project leverages a modern, full-stack JavaScript architecture with advanced browser automation capabilities.

<p align="left">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/Chrome%20Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension"/>
</p>

### **Frontend (Extension)**
- **Chrome Extension API**: For browser integration and tab management
- **Content Script Injection**: For DOM manipulation and data extraction
- **Modern CSS**: Glassmorphism design with animations and responsive layout
- **Real-time Communication**: Message passing between popup and content scripts

### **Backend Infrastructure**
- **Express.js API**: RESTful endpoints for data processing
- **Sequelize ORM**: Database abstraction with model relationships
- **SQLite Database**: Lightweight, efficient data storage
- **CORS Support**: Cross-origin resource sharing for browser compatibility

---

## ⚙️ Setup and Installation

To run this project, you need to set up both the backend server and the Chrome extension.

### 1. 🖥️ Backend Server

**Prerequisites:**
-   [Node.js](https://nodejs.org/) (v14 or higher)

**Instructions:**
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anoushka-10/Title-Popup.git
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

### 2. 🌐 Chrome Extension

1.  Open Google Chrome and navigate to `chrome://extensions`
2.  Enable **Developer mode** in the top-right corner
3.  Click **Load unpacked**
4.  Select the root folder containing the extension's files (`manifest.json`, `popup.html`, etc.)
5.  The extension will now be active in your browser toolbar

### 3. 🔑 LinkedIn Setup

**Important:** You must be logged into LinkedIn before using either mode.

1. Open LinkedIn in your browser
2. Log in to your account
3. For **Profile Scraper**: You can be on any LinkedIn page
4. For **Feed Interaction**: Navigate to your LinkedIn feed manually first

---

## 📖 Usage Guide

### **🔍 Profile Scraper Mode**

1. **Switch to Profile Scraper** tab in the extension popup
2. **Add LinkedIn URLs**: Paste profile URLs (one per line) in the text area
3. **Start Scraping**: Click "🚀 Start Scraping" to begin automated data collection
4. **Monitor Progress**: Watch real-time updates as profiles are processed
5. **Access Data**: Scraped data is automatically saved to the database

**Example URLs:**
```
https://www.linkedin.com/in/john-doe/
https://www.linkedin.com/in/jane-smith/
https://www.linkedin.com/in/tech-expert/
```

### **⚡ Feed Interaction Mode**

1. **Navigate to LinkedIn Feed** manually in your browser
2. **Switch to Feed Interaction** tab in the extension popup
3. **Set Interaction Counts**:
   - **Like Count**: Number of posts to like (1-50)
   - **Comment Count**: Number of posts to comment on (1-20)
4. **Start Automation**: Click "🚀 Start Interaction" (button enables only when both fields are filled)
5. **Monitor Activity**: Watch real-time progress as the extension interacts with posts

**Features:**
- Automatically scrolls through feed to find posts
- Randomly selects posts for interaction
- Uses "CFBR" as generic comment text
- Avoids duplicate interactions on the same posts
- Implements human-like delays and behaviors

---

## 🏗️ System Architecture

The project operates on a sophisticated three-tier architecture that creates a complete automation pipeline:

### **Frontend Layer**
1.  **Extension UI (`popup.js`)**: The command center that manages the user interface, controls both scraping and interaction workflows, and orchestrates the entire automation process
2.  **Content Script (`content.js`)**: Handles both profile data extraction and feed interaction automation, injected directly into LinkedIn pages for DOM manipulation

### **Backend Layer**
3.  **API Server (`server.js`)**: A Node.js and Express server that exposes RESTful endpoints for data management, using Sequelize to intelligently save profile data to the SQLite database

### **Data Pipeline**
- **Profile Scraper**: Extension → LinkedIn DOM → Content Script → API → Database
- **Feed Interaction**: Extension → LinkedIn Feed → Content Script → Real-time Actions
- **Communication**: Real-time message passing between popup and content scripts for progress updates

---

## 📊 Data Schema

### **Profile Data Structure**
```javascript
{
  name: "John Doe",
  location: "San Francisco, CA",
  bio: "Software Engineer at Tech Company",
  about: "Passionate about building scalable applications...",
  followerCount: 1500,
  connectionCount: 500,
  url: "https://www.linkedin.com/in/john-doe/",
  timestamp: "2025-01-15T10:30:00.000Z"
}
```

### **Interaction Tracking**
- Real-time counters for likes and comments completed
- Progress percentage calculation
- Duplicate post prevention with unique post ID tracking
- Success/failure status for each interaction attempt

---

## 🔧 Advanced Configuration

### **Scraper Settings**
- **Batch Size**: Process multiple profiles simultaneously
- **Delay Intervals**: Configurable delays between profile visits (default: 3-4 seconds)
- **Retry Logic**: Automatic retry for failed profile loads
- **Data Validation**: Ensures all extracted data meets quality standards

### **Interaction Settings**
- **Timing Controls**: Random delays between 1-4 seconds for natural behavior
- **Interaction Limits**: Prevents excessive automation (max 50 likes, 20 comments)
- **Smart Scrolling**: Loads more posts automatically when needed
- **Error Recovery**: Continues operation if individual interactions fail

### **Security Features**
- **Human-like Patterns**: Implements realistic mouse movements and typing patterns
- **Rate Limiting**: Built-in delays prevent detection by LinkedIn's anti-automation systems
- **Session Awareness**: Respects LinkedIn's login state and session management

---

## 🚨 Important Notes

### **Legal & Ethical Usage**
- This tool is intended for legitimate data collection and engagement purposes only
- Users must comply with LinkedIn's Terms of Service
- Respect rate limits and avoid excessive automation
- Only collect publicly available information

### **Best Practices**
- **Profile Scraper**: Use reasonable batch sizes (3-10 profiles at a time)
- **Feed Interaction**: Keep interaction counts moderate (5-10 interactions per session)
- **Timing**: Allow natural delays between operations
- **Monitoring**: Always supervise the extension while it's running

### **Technical Requirements**
- Must be logged into LinkedIn before starting any automation
- Stable internet connection required for reliable operation
- Chrome browser with extension developer mode enabled
- Backend server must be running for profile scraper functionality

---

## 🎥 Demo Video

A 5-minute screen recording demonstration is available showing:
- Extension setup and configuration
- Both automation modes in action
- Code explanation and architecture overview
- Database integration and data visualization

---

## 🔮 Future Enhancements

- **Advanced Filtering**: Smart post selection based on content type or author
- **Custom Comments**: Template-based comment generation with AI integration
- **Analytics Dashboard**: Detailed interaction statistics and success rates
- **Export Capabilities**: CSV/JSON export for both profile data and interaction logs
- **Scheduled Automation**: Time-based automation scheduling
- **Multi-account Support**: Handle multiple LinkedIn accounts seamlessly

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This tool is for educational and legitimate business purposes only. Users are responsible for complying with LinkedIn's Terms of Service and applicable laws. The authors are not responsible for any misuse of this software.

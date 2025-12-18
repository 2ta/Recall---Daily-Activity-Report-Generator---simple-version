
# Recall - Daily Activity & Report Generator

**Recall** is a seamless, local-first web application designed to help you track your daily activities and generate insightful summaries using Google's Gemini AI. It solves the problem of "forgetting what you did today" by providing a friction-less logging interface and intelligent reporting tools.

## ✨ Features

- **Timeline Logging**: Capture moments, tasks, and thoughts as they happen with a beautiful, mobile-optimized timeline.
- **AI-Powered Insights**:
  - **Daily Reflection**: Get a narrative summary of your day, highlighting accomplishments and areas for improvement.
  - **Manager Reports**: Generate professional weekly status reports tailored for corporate updates.
  - **Day Analysis**: Instantly identify key highlights and main focus areas of your day using `gemini-3-flash-preview`.
- **Smart Reminders**: Customizable notification system to nudge you to log your activities (Hourly, Every 2 hours, etc.).
- **Local-First Privacy**: All your logs are stored locally in your browser (`localStorage`). Your personal data never leaves your device unless you explicitly interact with AI features.
- **CSV Export**: Easy data portability allowing you to download your history.
- **Mobile-First Design**: Native app feel with splash screen, touch gestures, and responsive layout.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Icons**: Lucide React
- **Analytics (Optional)**: Supabase

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- A Google Cloud Project with the Gemini API enabled.
- (Optional) A Supabase project for analytics.

### Environment Variables

Create a `.env` file in the root directory:

```env
API_KEY=your_google_gemini_api_key
# Optional - for analytics
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📖 Usage Guide

1.  **Onboarding**: Upon first launch, you will see a splash screen followed by a setup modal. Grant notification permissions to enable smart reminders.
2.  **Logging**: Use the input bar at the bottom to type what you are doing. The placeholder text changes based on the time of day to prompt relevant inputs.
3.  **Editing**:
    - **Desktop**: Hover over a log entry to see Edit/Delete buttons.
    - **Mobile**: Tap the "..." menu next to a log to reveal actions.
4.  **Analysis**: Click the ✨ (Sparkles) icon in the header to have AI analyze your day and highlight important events.
5.  **Reports**: Use the header menu to generate Daily Reflections or Weekly Reports.

## 🔒 Privacy & Data

Recall operates on a **Local-First** model:
- **Logs**: Stored exclusively in your browser's `localStorage`.
- **AI Processing**: Data is sent to the Google Gemini API only when you request a summary or analysis.
- **Analytics**: Anonymous usage data (button clicks, feature interest) is sent to Supabase if configured, but contains no log content.

## 📄 License

This project is open source and available under the MIT License.

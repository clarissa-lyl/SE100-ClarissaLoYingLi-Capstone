# 📊 Finance Dashboard (React + Vite)

## Overview

This project is a **Finance Dashboard** built using **React** and **Vite**.  
It allows users to enter multiple stock purchases and automatically displays the **current stock price** and **profit/loss** for each stock using real-time data from the **AlphaVantage API**.

---

## ✨ Features

- Add stock purchases with:
  - Stock symbol
  - Quantity of shares
  - Purchase price per share
- Automatically fetches **current stock price** from AlphaVantage
- **Invalid stock symbols are ignored** and not added to the list
- Displays:
  - Current price per share
  - Profit/Loss per stock
- Profit/Loss is:
  - 🟢 **Green** when positive
  - 🔴 **Red** when negative

---

## Tech Stack

- **React**
- **Vite**
- **JavaScript (ES6+)**
- **CSS**
- **AlphaVantage API**
- **Vitest**
- **React Testing Library**

---

## How to Run the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<REPOSITORY_NAME>.git
cd <REPOSITORY_NAME>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up AlphaVantage API Key
#### Create a `.env` file in the project root:
```env
VITE_ALPHA_VANTAGE_KEY=your_api_key_here
```
#### For development/testing, you may use the demo key. Note: The demo key only supports the IBM stock symbol.
```env
VITE_ALPHA_VANTAGE_KEY=demo
```

### 4. Start the development server
```bash
npm run dev
```
### Execute the tests
```bash
npm run test
```

---

## Bugs & Challenges Encountered

### 1. Challenge: Structuring global state (Provider placement)
- Challenge: I was unsure whether to place the Provider (stocks state + API logic) belongs in the UI layer (App.jsx) or within the state module (StockContext.jsx).
- Resolution: After researching React best practices, I encapsulated the StockProvider within StockContext.jsx to centralise shared state and API logic, and wrapped the application with it in main.jsx. This keeps UI components focused on layout and rendering while enabling consistent access to global state through useContext.

### 2. Challenge: Using GenAI tools for large code generation versus incremental development
- Challenge: Generating the entire project upfront using GenAI tools made debugging difficult when the application failed to load.
- Resolution: I shifted to an incremental development approach, validating each change locally and using GenAI tools for focused guidance, which improved both debugging and architectural understanding.

### 3. Challenge: Asynchronous Testing & React State Updates
- Challenge: Handling asynchronous state updates during testing (e.g., API calls, effects).
- Resolution: Used proper async assertions (waitFor) to eliminate act warnings and ensure reliable test execution.

---

## Improvements Beyond Baseline Requirements
- Stricter input validation for quantity and purchase price fields to prevent invalid user input.
- Card-based, responsive dashboard layout using CSS Grid to maintain consistent alignment and formatting as data and screen sizes change.
- 4 portfolio KPI cards (Total Value, Total Invested, Profit/Loss, Performance) with derived values memoised with useMemo for performance.
- Dynamic visual indicators (↗ / ↘) that update based on computed Profit/Loss and Performance metrics.
- Secure configuration management for the AlphaVantage API key using environment variables and GitHub Actions secrets.
- Defensive API handling to validate API responses and prevent UI failures during fetch errors.
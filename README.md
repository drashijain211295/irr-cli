# AutoFin Core: Dual-Module IRR & CLI Financial Intelligence Platform

A modern, fast, professional financial web application built with **React 19**, **Vite**, **Tailwind CSS 4**, and **Redux Toolkit**.

This application converts two legacy Excel systems into an intuitive dual-module web application:
1. **IRR Module** (`IRR.xls`): Commercial Vehicle deal financing, flat-to-IRR conversion, and yield calculations matching ICICI Bank commercial vehicle finance rules.
2. **CLI Module** (`CLI Calculation Sheet.xlsx`): Credit Life Insurance actuarial pricing for Tata AIA Group Sampoorna Raksha Supreme with 6 full rate matrices, 18% GST calculation, funded circular reference resolution, and Non-Medical Limits (NML) underwriting.

---

## Features

- **Module Switcher**: Switch between IRR and CLI anytime with persistent state preserved in Redux.
- **Clean Numeric Inputs**: Text-only inputs with `inputMode="numeric"` to trigger mobile numeric keypads without up/down arrow spinners or accidental mouse scroll changes.
- **Empty Default State**: Placeholders show example values (`placeholder="2215156"`, `placeholder="50500"`, `placeholder="491000"`, etc.) without prefilled hardcoded numbers.
- **Instant Real-Time Calculations**: All yields, flat rates, agreement values, and single premiums recalculate dynamically on every keystroke.
- **High Mathematical Precision**: Decoupled calculation engines verified by Vitest unit tests matching original Excel sheets to exact decimal precision.

---

## Technology Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, React Router DOM 7
- **State Management**: Redux Toolkit & LocalStorage persistence
- **Testing**: Vitest
- **Icons**: Lucide React
- **Visualization**: Recharts

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Calculation Unit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

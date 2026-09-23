# LittleLoop

**A simple, family-friendly hub for organizing and managing children's activities.**

LittleLoop helps parents keep track of their children's busy schedules in one place — from sports practices and music lessons to school events, appointments, packing lists, transportation, and everything in between.

Instead of managing multiple calendars, notes, messages, and reminders, LittleLoop brings the family's activity schedule into a single, visual interface.

## ✨ Features

### 📅 Flexible calendar views

View the family's schedule in the format that works best for you:

* **Week view** — see the family's upcoming schedule at a glance
* **Month view** — get a broader overview of busy periods
* **Day view** — focus on a single day's activities
* **Agenda view** — browse activities in a chronological list

### 👨‍👩‍👧‍👦 Multiple children

Manage activities for multiple children from a single calendar.

* Add, edit, and remove children
* Assign activities to one or multiple children
* Filter the calendar by child
* Quickly identify which child is involved in each activity

### 🏃 Activity management

Create and manage activities with information such as:

* Activity name
* Date and time
* Location and address
* Assigned driver
* Category
* Notes
* Participating children
* Completion status
* Packing/checklist items

Activities can be edited, completed, or removed directly from the calendar.

### 🎒 Packing checklists

Each activity can have its own checklist.

For example:

* ⚽ Cleats
* 🥤 Water bottle
* 👕 Extra clothes
* 🎾 Equipment
* 📚 School materials

Checklist items can be added, removed, and marked as completed.

### 🚗 Transportation & carpooling

Activities can include an assigned driver, making it easier to keep track of who is responsible for getting the children where they need to be.

### ⚠️ Schedule conflict detection

LittleLoop automatically detects scheduling conflicts across activities and children, helping parents spot overlapping commitments before they become a problem.

### 🔔 Activity reminders

Built-in notifications help prevent missed activities.

The notification system supports:

* Configurable lead time
* In-app alerts
* Optional notification sounds
* Optional browser notifications
* Alert dismissal
* Alert snoozing
* Test notifications

### 🔎 Search & filtering

Find activities quickly using:

* Child
* Activity category
* Activity title
* Location
* Driver
* Notes

### 🌓 Light & dark mode

LittleLoop supports:

* Light mode
* Dark mode
* System preference

### 🖨️ Printable family schedule

Generate a print-friendly family schedule that can be placed on a refrigerator, family bulletin board, or anywhere else the family keeps its weekly plans.

The printable version includes relevant activity details, participating children, locations, drivers, and packing lists.

## 🛠️ Tech Stack

LittleLoop is built with modern web technologies:

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React** for icons
* **Motion** for animations
* **Express** for server-side functionality
* **Google Gemini API** integration
* **Browser Local Storage** for local persistence

The application is a client-focused web app and currently stores calendar and family data locally in the browser.

## 🚀 Getting Started

### Prerequisites

Make sure you have a recent version of:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/tudor-dragomir/LittleLoop-1.git
cd LittleLoop-1
```

Install dependencies:

```bash
npm install
```

### Environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the required variables in `.env`.

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

> **Note:** Keep API keys private and never commit your `.env` file to the repository.

### Run locally

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## 📦 Available Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the development server        |
| `npm run build`   | Create a production build           |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run TypeScript checks               |
| `npm run clean`   | Remove generated build/server files |

## 🧩 Project Structure

```text
LittleLoop-1/
├── src/
│   ├── components/      # UI components and modals
│   ├── context/         # Application state and calendar logic
│   ├── data/             # Sample/default data
│   ├── utils/            # Date, notification and helper utilities
│   ├── types/            # Shared TypeScript types
│   ├── App.tsx           # Main application
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The central calendar state is managed through a React context, including children, activities, filters, notifications, themes, and calendar navigation. Application data is persisted using browser `localStorage`.

## 💾 Data & Privacy

LittleLoop currently uses browser-based local storage for core application data.

This means that, in the current version:

* Family and activity data is stored locally in the browser.
* There is no requirement for a user account to manage the calendar.
* Data is tied to the browser/device being used.
* Clearing browser storage can remove locally stored application data.

For production use, a future version could introduce optional cloud synchronization and family accounts.

## 🗺️ Roadmap

LittleLoop is an evolving project. Potential future improvements include:

* [ ] User accounts and authentication
* [ ] Cloud synchronization
* [ ] Family sharing
* [ ] Shared calendars between parents
* [ ] Recurring activities
* [ ] Calendar import/export
* [ ] Google Calendar / Apple Calendar integration
* [ ] Richer carpool management
* [ ] Automated activity suggestions
* [ ] AI-assisted family scheduling
* [ ] Mobile/PWA improvements
* [ ] More advanced notification rules
* [ ] Statistics and activity history

## 🎯 Project Vision

LittleLoop started with a simple idea:

> **Managing a family's schedule shouldn't feel like managing a small company.**

Children often have multiple activities happening across different days, locations, and responsibilities. The goal of LittleLoop is to make that complexity easier to see and manage without turning family planning into another complicated productivity system.

The focus is on **clarity, simplicity, and the practical realities of family life**.

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

If you have an idea for improving LittleLoop:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the type checks and production build
5. Open a pull request

## 📄 License

MIT License
Copyright (c) 2026 Tudor Dragomir


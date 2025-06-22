# Smart Task Planner

**Smart Task Planner** is a modern, responsive web application designed to help users manage and organize their daily tasks efficiently. Built with React and Tailwind CSS, the app offers a clean UI, intuitive drag-and-drop functionality for task organization, and visual insights through charts.

---
![image](https://github.com/user-attachments/assets/b8aef762-9e93-4c06-844d-b4db9ca7d9df)


## 🚀 Features

- 📋 Create, manage, and prioritize tasks
- 📌 Drag-and-drop task organization (via `@dnd-kit`)
- 📅 Date handling with `date-fns`
- 📊 Visualizations using `recharts`
- 🌙 Modern UI with `lucide-react` icons and Tailwind CSS
- 🔄 Client-side routing with `react-router-dom`

---

## 🛠️ Tech Stack

| Tech             | Purpose                                  |
|------------------|------------------------------------------|
| **React**        | Core library for building UI             |
| **Tailwind CSS** | Utility-first CSS framework              |
| **Vite**         | Lightning-fast build tool                |
| **React Router** | Routing and navigation                   |
| **@dnd-kit**     | Drag-and-drop support                    |
| **Lucide-react** | Icon library                             |
| **date-fns**     | Date manipulation                        |
| **Recharts**     | Charting and data visualization          |
| **TypeScript**   | Strong typing and developer tooling      |

---

## 📁 Project Structure
SmartTask-main/
│
├── public/ # Static assets
├── src/ # Source code
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── App.tsx # Root component
│ └── main.tsx # Entry point
├── index.html # HTML template
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
├── tsconfig.json # TypeScript configuration
└── package.json # Project metadata and dependencies

---

## 📦 Installation & Setup

```bash
# 1. Clone the repository
git clone (https://github.com/nithishdurnala-19/SmartTask.git)
cd smart-task-planner

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Runs the app in development mode |
| `npm run build`   | Builds the app for production    |
| `npm run preview` | Previews the production build    |
| `npm run lint`    | Runs ESLint to check code style  |


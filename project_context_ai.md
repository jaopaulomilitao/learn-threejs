# AI Context & Instruction File
Generated on: Tue, Mar 10, 2026 11:30:37 AM

## 1. System Role & Methodology
You are an expert full-stack developer proficient in TypeScript, React, Next.js 14 (App Router), Firebase, and Zustand. 
Your specific domain expertise is in building scalable Educational Platforms (LMS) and Gamification Systems.

### Critical Personal Preferences (MUST FOLLOW):
- **Language:** English only.
- **Comments:** Direct, impersonal verbs, lowercase (e.g., `// fetches the user gamification profile`).
- **Clean Code:** DRY, meaningful names, small functions. High focus on UI/UX and scalable infrastructure.

### Architecture & Best Practices
- **Framework:** Next.js 14 (App Router). Leverage Server Components for static/shared class data and Client Components for interactive gamification UI.
- **Styling:** Tailwind CSS (Mobile First).
- **State Management (Zustand):** - Use the "slices" pattern.
  - Manage global UI state (modals, notifications) and user session/gamification cache (current XP, level, badges).
- **Firebase & Data Modeling:**
  - Structure NoSQL data carefully to minimize document reads (e.g., separate heavy gamification event logs from the basic user profile).
  - Use custom hooks to encapsulate Firestore listeners and Auth logic.
  - Implement strict Role-Based Access Control (RBAC) (e.g., Student vs. Professor).
- **Gamification Logic:**
  - Design extensible systems for points, levels, and achievements.
- **Structure:** Kebab-case directories (e.g., `components/leaderboard-card`).

### Objective
Create a secure, highly scalable, and engaging full-stack platform for university classes with clean and maintainable code.

## 2. Project Directory Structure
```
.
./.env.local
./.eslintrc.json
./components.json
./LICENSE
./next.config.mjs
./next-env.d.ts
./package.json
./package-lock.json
./pnpm-lock.yaml
./postcss.config.mjs
./project_context_ai.md
./public
./public/imgs
./public/imgs/background.jpg
./public/looties
./public/looties/duck-talk.json
./public/ui
./public/ui/logo-horizontal.svg
./public/ui/logo-reduzida-horizontal.svg
./README.md
./src
./src/app
./src/app/edit
./src/app/edit/page.tsx
./src/app/favicon.ico
./src/app/globals.css
./src/app/layout.tsx
./src/app/learn
./src/app/learn/page.tsx
./src/app/login
./src/app/login/page.tsx
./src/app/page.tsx
./src/components
./src/components/layout
./src/components/layout/editor
./src/components/layout/mobile-header
./src/components/layout/sidebar
./src/components/ui
./src/components/ui/accordion.tsx
./src/components/ui/avatar.tsx
./src/components/ui/button.tsx
./src/components/ui/button-menu-aside
./src/components/ui/dropdown-menu.tsx
./src/components/ui/extension-button
./src/components/ui/image-uploader
./src/components/ui/sheet.tsx
./src/components/ui/skeleton
./src/components/ui/skeleton.tsx
./src/components/ui/tooltip.tsx
./src/features
./src/features/auth
./src/features/auth/api
./src/features/auth/hooks
./src/features/images
./src/features/images/api
./src/features/lessons
./src/features/lessons/api
./src/features/lessons/components
./src/features/lessons/hooks
./src/features/lessons/store
./src/features/lessons/types
./src/lib
./src/lib/firebase
./src/lib/firebase/config.ts
./src/lib/tiptap
./src/lib/tiptap/extensions
./src/lib/utils.ts
./src/store
./src/store/useLessonStore.ts
./tailwind.config.ts
./tsconfig.json
./update_context.sh
```

## 3. Dependencies
```json
{
  "name": "learn-threejs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@nextui-org/react": "^2.4.8",
    "@nextui-org/skeleton": "^2.0.32",
    "@tiptap/core": "^2.8.0",
    "@tiptap/extension-blockquote": "^2.8.0",
    "@tiptap/extension-bullet-list": "^2.8.0",
    "@tiptap/extension-code-block": "^2.8.0",
    "@tiptap/extension-heading": "^2.8.0",
    "@tiptap/extension-horizontal-rule": "^2.8.0",
    "@tiptap/extension-image": "^2.8.0",
    "@tiptap/extension-link": "^2.8.0",
    "@tiptap/extension-list-item": "^2.8.0",
    "@tiptap/extension-ordered-list": "^2.8.0",
    "@tiptap/extension-paragraph": "^2.9.1",
    "@tiptap/extension-text": "^2.9.1",
    "@tiptap/extension-text-align": "^2.8.0",
    "@tiptap/react": "^2.7.4",
    "@tiptap/starter-kit": "^2.7.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^10.13.2",
    "geist": "^1.7.0",
    "highlight.js": "^11.10.0",
    "lowlight": "^3.1.0",
    "lucide-react": "^0.577.0",
    "next": "14.2.13",
    "prosemirror-model": "^1.23.0",
    "radix-ui": "^1.4.3",
    "react": "^18",
    "react-dom": "^18",
    "react-icons": "^5.3.0",
    "react-lottie": "^1.2.4",
    "shadcn": "^4.0.2",
    "tailwind-merge": "^3.5.0",
    "tailwindcss-animate": "^1.0.7",
    "tiptap-extension-resize-image": "^1.1.9",
    "tw-animate-css": "^1.4.0",
    "uuid": "^10.0.0",
    "zustand": "^5.0.11"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/react-lottie": "^1.2.10",
    "@types/uuid": "^10.0.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.13",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

## 4. Design System

### Global CSS
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.58 0.22 27);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --radius: 0.625rem;
  }
  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.87 0.00 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.371 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    /* font-family: 'Inter', sans-serif; */
  }
}

/* Suas customizações mantidas abaixo */
p:empty {
  display: block;
  height: 1em;
}

h1 { @apply text-3xl; }
h2 { @apply text-2xl; }
h3 { @apply text-xl; }

.ProseMirror:focus {
  outline: none;
}

.editor-link {
  cursor: pointer;
  color: rgb(80, 163, 163);
  font-weight: bold;
}

.editor-link:hover {
  color: darkblue;
}

/* Custom Scrollbar for Sidebar */
.custom-scrollbar {
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.custom-dash {
  --b: 4px;   /* Espessura da borda */
  --s: 20px;  /* Tamanho do traço (dash) */
  --c: #333;  /* Cor */
  
  padding: 10px;
  background: repeating-linear-gradient(90deg, var(--c) 0 var(--s), #0000 0 calc(var(--s) * 2)) 0/100% var(--b) no-repeat,
              repeating-linear-gradient(0deg, var(--c) 0 var(--s), #0000 0 calc(var(--s) * 2)) 100%/var(--b) 100% no-repeat,
              repeating-linear-gradient(90deg, var(--c) 0 var(--s), #0000 0 calc(var(--s) * 2)) 0 100%/100% var(--b) no-repeat,
              repeating-linear-gradient(0deg, var(--c) 0 var(--s), #0000 0 calc(var(--s) * 2)) 0 0/var(--b) 100% no-repeat;
}

/* Animação garantida para os Acordeões do Shadcn (Radix UI) */
[data-radix-accordion-content] {
  overflow: hidden;
}

[data-radix-accordion-content][data-state="open"] {
  animation: slideDown 0.3s cubic-bezier(0.87, 0, 0.13, 1) forwards;
}

[data-radix-accordion-content][data-state="closed"] {
  animation: slideUp 0.3s cubic-bezier(0.87, 0, 0.13, 1) forwards;
}

@keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    height: var(--radix-accordion-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
}
```

### Tailwind Config
```typescript
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        geist: ["var(--font-geist-sans)", "sans-serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        'main-white': '#F5F6F7',
        'main-black': '#334155',
        'main-red': '#FF4B4B',
        'main-green': '#00D287',
        'main-blue': '#1E88E5',
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // ANIMAÇÕES DO SHADCN ADICIONADAS AQUI
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

## 5. Core Infrastructure Context
Review these files to understand the database schema, RBAC, and global state.

### Firebase Config & Services
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
```

### Zustand Stores
```typescript
import { create } from 'zustand';
import { deleteLesson, fetchLessons, Lesson } from '../api/firestore';

interface LessonState {
    lessons: Lesson[];
    // fetches all lessons from the database and updates the store
    loadLessons: () => Promise<void>;
    // removes a lesson from the store and database optimistically
    removeLesson: (id: string) => Promise<void>;
    activeTopic: string | null;
    setActiveTopic: (topic: string | null) => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
    lessons: [],
    
    activeTopic: null,
    setActiveTopic: (topic) => set({ activeTopic: topic }),
    loadLessons: async () => {
        try {
            // fetches the sorted lessons
            const data = await fetchLessons();
            set({ lessons: data as unknown as Lesson[] });
        } catch (error) {
            console.error('failed to load lessons:', error);
        }
    },

    removeLesson: async (id: string) => {
        // saves the current state in case of an error
        const previousLessons = get().lessons;

        // updates the ui optimistically 
        set({ lessons: previousLessons.filter((lesson) => lesson.id !== id) });

        try {
            // executes the database deletion
            await deleteLesson(id);
        } catch (error) {
            // restores the previous state if the database operation fails
            set({ lessons: previousLessons });
            console.error('failed to delete lesson:', error);
        }
    },
})); ```

---
## 6. Current Task
I will provide a request based on the context above.
- Use the **Core Infrastructure Context** to ensure your code aligns with the existing NoSQL data models and Zustand state.

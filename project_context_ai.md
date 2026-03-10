# AI Context & Instruction File
Generated on: Tue, Mar 10, 2026  1:11:01 PM

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
./src/app/(dashboard)
./src/app/(dashboard)/layout.tsx
./src/app/(dashboard)/learn
./src/app/(dashboard)/roadmap
./src/app/edit
./src/app/edit/page.tsx
./src/app/favicon.ico
./src/app/globals.css
./src/app/layout.tsx
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
./src/features/roadmap
./src/features/roadmap/api
./src/features/roadmap/components
./src/features/roadmap/store
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
    "@xyflow/react": "^12.10.1",
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
    selectedLessonId: string | null;
    setSelectedLessonId: (id: string | null) => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
    lessons: [],
    activeTopic: null,
    selectedLessonId: null,
    
    // sets the active scroll topic
    setActiveTopic: (topic) => set({ activeTopic: topic }),
    
    // sets the currently selected lesson for the viewer
    setSelectedLessonId: (id) => set({ selectedLessonId: id }),
    
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
}));import { create } from "zustand";
import {
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
  Connection,
  addEdge,
} from "@xyflow/react";
import { CustomNode, fetchRoadmap } from "../api/firestore";

interface RoadmapState {
  nodes: CustomNode[];
  edges: Edge[];
  selectedQuest: CustomNode | null;
  isSheetOpen: boolean;
  isLoading: boolean;

  // actions
  loadRoadmap: () => Promise<void>;
  onNodesChange: (changes: NodeChange<CustomNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  openQuestSheet: (node: CustomNode) => void;
  closeQuestSheet: () => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedQuest: null,
  isSheetOpen: false,
  isLoading: true,

  // loads data from database
  loadRoadmap: async () => {
    set({
      isLoading: false,
      nodes: [
        // ==========================================
        // MÓDULO 1: O ESPAÇO
        // ==========================================
        {
          id: "mod-1",
          type: "divider",
          position: { x: 0, y: 0 },
          data: { label: "Módulo 1: O Espaço e o Pipeline" },
          selectable: false,
          draggable: false,
        },

        {
          id: "1",
          type: "quest",
          position: { x: 400, y: 80 },
          data: {
            label: "O Paradigma Gráfico",
            status: "completed",
            questType: "main",
            description:
              "A jornada do pixel. Compreenda a arquitetura de renderização, desde a abstração de um modelo matemático até a rasterização final na matriz da tela.",
            lessonId: "L1",
          },
        },
        {
          id: "2",
          type: "quest",
          position: { x: 400, y: 200 },
          data: {
            label: "O Ambiente WebGL",
            status: "active",
            questType: "main",
            description:
              "Seu primeiro render. Estruturaremos o loop de renderização clássico e instanciaremos o motor gráfico utilizando a poderosa API do Three.js.",
            lessonId: "L53zJtqQX12q7RUaBcdz",
          },
        },

        {
          id: "3",
          type: "quest",
          position: { x: 250, y: 320 },
          data: {
            label: "A Matemática do Espaço",
            status: "active",
            questType: "main",
            description:
              "Transformações afins e coordenadas homogêneas. Dominaremos o uso de matrizes para translação, rotação e escala de vetores no espaço R3.",
            lessonId: "PDgs0YQrA24a65XJyBcm",
          },
        },
        {
          id: "3-side",
          type: "quest",
          position: { x: 600, y: 320 },
          data: {
            label: "A Essência da Álgebra Linear",
            status: "active",
            questType: "side",
            description:
              "Recomendação fundamental (3Blue1Brown). Uma construção visual impecável sobre vetores, bases e espaço nulo. Essencial para desenvolver intuição matemática pura.",
            externalLink:
              "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
          },
        },

        {
          id: "4",
          type: "quest",
          position: { x: 400, y: 440 },
          data: {
            label: "Câmeras e Projeções",
            status: "locked",
            questType: "main",
            description:
              "A geometria da visualização. Exploraremos o volume de visão (View Frustum) e a álgebra por trás das matrizes de projeção perspectiva e ortográfica.",
            lessonId: "L4",
          },
        },

        // ==========================================
        // MÓDULO 2: O OBJETO
        // ==========================================
        {
          id: "mod-2",
          type: "divider",
          position: { x: 0, y: 560 },
          data: { label: "Módulo 2: O Objeto e a Forma" },
          selectable: false,
          draggable: false,
        },

        {
          id: "5",
          type: "quest",
          position: { x: 250, y: 640 },
          data: {
            label: "Topologia e Geometria",
            status: "locked",
            questType: "main",
            description:
              "A estrutura da forma. Compreenderemos a alocação de memória na GPU para vértices, índices de faces e vetores normais utilizando BufferGeometries.",
            lessonId: "L5",
          },
        },
        {
          id: "6",
          type: "quest",
          position: { x: 400, y: 760 },
          data: {
            label: "A Superfície do Objeto",
            status: "locked",
            questType: "main",
            description:
              "O envoltório matemático. Implementaremos materiais fundamentais e mapeamento UV antes de introduzirmos interações complexas com fontes de luz.",
            lessonId: "L6",
          },
        },
        {
          id: "7",
          type: "quest",
          position: { x: 400, y: 880 },
          data: {
            label: "Modelagem 3D no Blender",
            status: "locked",
            questType: "main",
            description:
              "A arte de esculpir vértices. Introdução ao ecossistema do Blender, explorando modelagem poligonal, modificadores e o pipeline rigoroso de exportação de malhas (GLTF/GLB) para o ambiente WebGL.",
            lessonId: "L7",
          },
        },
        // ==========================================
        // MÓDULO 3: A LUZ
        // ==========================================
        {
          id: "mod-3",
          type: "divider",
          position: { x: 0, y: 1000 },
          data: { label: "Módulo 3: Luz, Sombra e Shaders" },
          selectable: false,
          draggable: false,
        },

        {
          id: "8",
          type: "quest",
          position: { x: 400, y: 1080 },
          data: {
            label: "A Física da Luz (PBR)",
            status: "locked",
            questType: "main",
            description:
              "Simulando fótons. Estudaremos a equação de renderização, algoritmos clássicos de reflexão (Phong, Blinn) e materiais rigorosamente baseados em física (PBR).",
            lessonId: "L8",
          },
        },

        {
          id: "9",
          type: "quest",
          position: { x: 250, y: 1200 },
          data: {
            label: "A Engenharia dos Shaders",
            status: "locked",
            questType: "main",
            description:
              "Programação direta na GPU. Abandonaremos abstrações prontas para escrever nossos próprios Vertex e Fragment Shaders (GLSL) com alto controle matemático.",
            lessonId: "L9",
          },
        },
        {
          id: "9-side",
          type: "quest",
          position: { x: 600, y: 1200 },
          data: {
            label: "The Book of Shaders",
            status: "locked",
            questType: "side",
            description:
              "A bíblia da geração procedural. Um material literário indispensável para masterizar funções trigonométricas e ruídos matemáticos na geração de texturas.",
            externalLink: "https://thebookofshaders.com/",
          },
        },

        // ==========================================
        // MÓDULO 4: A DINÂMICA
        // ==========================================
        {
          id: "mod-4",
          type: "divider",
          position: { x: 0, y: 1320 },
          data: { label: "Módulo 4: Dinâmica e Interatividade" },
          selectable: false,
          draggable: false,
        },

        {
          id: "10",
          type: "quest",
          position: { x: 400, y: 1400 },
          data: {
            label: "O Vetor Tempo",
            status: "locked",
            questType: "main",
            description:
              'O motor da vida digital. Aprofundaremos em interpolações (Lerp), quatérnios para evitar o "Gimbal Lock" e a gerência sagrada do Delta Time.',
            lessonId: "L10",
          },
        },
        {
          id: "10-side",
          type: "quest",
          position: { x: 600, y: 1400 },
          data: {
            label: "A Ilusão da Vida",
            status: "locked",
            questType: "side",
            description:
              "Os 12 princípios da animação da Disney. Um estudo rigoroso sobre como conceitos tradicionais elevam a percepção de inércia e peso em corpos virtuais 3D.",
            externalLink: "https://www.youtube.com/watch?v=uDqjIdI4bF4",
          },
        },

        {
          id: "11",
          type: "quest",
          position: { x: 250, y: 1520 },
          data: {
            label: "Colisões e Raycasting",
            status: "locked",
            questType: "main",
            description:
              "Mecânicas de interação. Projetaremos vetores do espaço de tela (2D) para o espaço de mundo (3D) para cálculo analítico de interseção geométrica.",
            lessonId: "L11",
          },
        },
        {
          id: "12",
          type: "quest",
          position: { x: 400, y: 1640 },
          data: {
            label: "Anatomia e Rigging",
            status: "locked",
            questType: "main",
            description:
              "Deformação de malhas orgânicas (Skinning). Compreenderemos como matrizes hierárquicas virtuais (esqueletos) governam a posição de milhões de vértices.",
            lessonId: "L12",
          },
        },
        {
          id: "13",
          type: "quest",
          position: { x: 250, y: 1760 },
          data: {
            label: "Arquitetura de Otimização",
            status: "locked",
            questType: "main",
            description:
              'O custo do milissegundo. Análise de gargalos (Profiling), técnicas de redução de "Draw Calls" e instanciamento intensivo de geometria via Spector.js.',
            lessonId: "L13",
          },
        },

        // ==========================================
        // MÓDULO 5: TÓPICOS ESPECIAIS
        // ==========================================
        {
          id: "mod-5",
          type: "divider",
          position: { x: 0, y: 1880 },
          data: { label: "Módulo 5: Tópicos Especiais" },
          selectable: false,
          draggable: false,
        },

        {
          id: "14",
          type: "quest",
          position: { x: 400, y: 1960 },
          data: {
            label: "O Paradigma das Engines",
            status: "locked",
            questType: "main",
            description:
              "Transição arquitetural. Mapearemos os conceitos matemáticos aprendidos para o robusto pipeline de nós e sistemas integrados da Godot Engine.",
            lessonId: "L14",
          },
        },

        {
          id: "15",
          type: "quest",
          position: { x: 400, y: 2080 },
          data: {
            label: "Fronteiras Computacionais",
            status: "locked",
            questType: "main",
            description:
              "O estado da arte. Introdução aos fundamentos de tracking para Realidade Virtual (WebXR) e a iminente revolução das APIs gráficas modernas (WebGPU/Vulkan).",
            lessonId: "L15",
          },
        },
        {
          id: "15-side",
          type: "quest",
          position: { x: 600, y: 2080 },
          data: {
            label: "Pesquisa: Path Tracing",
            status: "locked",
            questType: "side",
            description:
              "Seminário técnico da Disney. Uma análise sobre o Ray Tracing estocástico e a equação integral responsável por simular a dispersão real da luz no cinema atual.",
            externalLink: "https://www.youtube.com/watch?v=frLwRLS_ZR0",
          },
        },
      ],
      edges: [
        // Modulo 1
        { id: "e1-2", source: "1", target: "2", animated: true },
        { id: "e2-3", source: "2", target: "3", animated: true },
        { id: "e2-3s", source: "2", target: "3-side", animated: true },
        { id: "e3-4", source: "3", target: "4" },
        // Modulo 2
        { id: "e4-5", source: "4", target: "5" },
        { id: "e5-6", source: "5", target: "6" },
        { id: "e6-7", source: "6", target: "7" },
        // Modulo 3
        { id: "e7-8", source: "7", target: "8" },
        { id: "e8-9", source: "8", target: "9" },
        { id: "e8-9s", source: "8", target: "9-side" },
        // Modulo 4
        { id: "e9-10", source: "9", target: "10" },
        { id: "e10-10s", source: "10", target: "10-side" },
        { id: "e10-11", source: "10", target: "11" },
        { id: "e11-12", source: "11", target: "12" },
        { id: "e12-13", source: "12", target: "13" },
        // Modulo 5
        { id: "e13-14", source: "13", target: "14" },
        { id: "e14-15", source: "14", target: "15" },
        { id: "e14-15s", source: "14", target: "15-side" },
      ],
    });
  },

  // handles internal react flow node movements
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as CustomNode[] });
  },

  // handles internal react flow edge changes
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  // creates a new edge between nodes
  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  },

  // opens the side sheet with the clicked quest data
  openQuestSheet: (node) => {
    set({ selectedQuest: node, isSheetOpen: true });
  },

  // closes the side sheet
  closeQuestSheet: () => {
    set({ isSheetOpen: false, selectedQuest: null });
  },
}));
```

---
## 6. Current Task
I will provide a request based on the context above.
- Use the **Core Infrastructure Context** to ensure your code aligns with the existing NoSQL data models and Zustand state.

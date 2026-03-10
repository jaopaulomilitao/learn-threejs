#!/bin/bash

# --- CONFIGURAÇÃO ---
OUTPUT_FILE="project_context_ai.md"

# 1. Definição do Prompt do Sistema
cat <<EOF > "$OUTPUT_FILE"
# AI Context & Instruction File
Generated on: $(date)

## 1. System Role & Methodology
You are an expert full-stack developer proficient in TypeScript, React, Next.js 14 (App Router), Firebase, and Zustand. 
Your specific domain expertise is in building scalable Educational Platforms (LMS) and Gamification Systems.

### Critical Personal Preferences (MUST FOLLOW):
- **Language:** English only.
- **Comments:** Direct, impersonal verbs, lowercase (e.g., \`// fetches the user gamification profile\`).
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
- **Structure:** Kebab-case directories (e.g., \`components/leaderboard-card\`).

### Objective
Create a secure, highly scalable, and engaging full-stack platform for university classes with clean and maintainable code.
EOF

# 2. Estrutura de Diretórios
echo -e "\n## 2. Project Directory Structure" >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"
if command -v tree &> /dev/null; then
    tree -a . -I "node_modules|.next|.git|.swc|dist|coverage|.venv" --dirsfirst >> "$OUTPUT_FILE"
else
    find . -maxdepth 4 -not -path './.git*' -not -path './node_modules*' -not -path './.next*' | sort >> "$OUTPUT_FILE"
fi
echo '```' >> "$OUTPUT_FILE"

# 3. Dependências
echo -e "\n## 3. Dependencies" >> "$OUTPUT_FILE"
echo '```json' >> "$OUTPUT_FILE"
jq '{dependencies, devDependencies}' package.json 2>/dev/null || cat package.json >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

# 4. Design System (Corrigido para evitar quebra de formatação)
echo -e "\n## 4. Design System" >> "$OUTPUT_FILE"

if [ -f "src/app/globals.css" ]; then
    echo -e "\n### Global CSS" >> "$OUTPUT_FILE"
    echo '```css' >> "$OUTPUT_FILE"
    cat src/app/globals.css >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE" # Força quebra de linha
    echo '```' >> "$OUTPUT_FILE"
fi

# checks for tailwind config in typescript or javascript
if [ -f "tailwind.config.ts" ]; then
    echo -e "\n### Tailwind Config" >> "$OUTPUT_FILE"
    echo '```typescript' >> "$OUTPUT_FILE"
    cat tailwind.config.ts >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE" # Força quebra de linha
    echo '```' >> "$OUTPUT_FILE"
elif [ -f "tailwind.config.js" ]; then
    echo -e "\n### Tailwind Config" >> "$OUTPUT_FILE"
    echo '```javascript' >> "$OUTPUT_FILE"
    cat tailwind.config.js >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE" # Força quebra de linha
    echo '```' >> "$OUTPUT_FILE"
elif [ -f "tailwind.config.mjs" ]; then
    echo -e "\n### Tailwind Config" >> "$OUTPUT_FILE"
    echo '```javascript' >> "$OUTPUT_FILE"
    cat tailwind.config.mjs >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE" # Força quebra de linha
    echo '```' >> "$OUTPUT_FILE"
fi

# 5. Core Infrastructure (Firebase & Zustand)
echo -e "\n## 5. Core Infrastructure Context" >> "$OUTPUT_FILE"
echo "Review these files to understand the database schema, RBAC, and global state." >> "$OUTPUT_FILE"

if [ -d "src/lib/firebase" ] || [ -d "src/firebase" ]; then
    echo -e "\n### Firebase Config & Services" >> "$OUTPUT_FILE"
    echo '```typescript' >> "$OUTPUT_FILE"
    find src/lib/firebase src/firebase -maxdepth 1 -name "*.ts" -exec cat {} + 2>/dev/null >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
fi

if [ -d "src/store" ] || [ -d "src/stores" ]; then
    echo -e "\n### Zustand Stores" >> "$OUTPUT_FILE"
    echo '```typescript' >> "$OUTPUT_FILE"
    find src/features/*/store src/stores -maxdepth 1 -name "*.ts" -exec cat {} + 2>/dev/null >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
fi

if [ -d "src/types" ] || [ -d "src/models" ]; then
    echo -e "\n### Data Models & Types" >> "$OUTPUT_FILE"
    echo '```typescript' >> "$OUTPUT_FILE"
    find src/types src/models -maxdepth 1 -name "*.ts" -exec cat {} + 2>/dev/null >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
fi

# 6. Instrução Final
cat <<EOF >> "$OUTPUT_FILE"

---
## 6. Current Task
I will provide a request based on the context above.
- Use the **Core Infrastructure Context** to ensure your code aligns with the existing NoSQL data models and Zustand state.
EOF

echo "✅ Context file updated: $OUTPUT_FILE"
import { create } from "zustand";
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

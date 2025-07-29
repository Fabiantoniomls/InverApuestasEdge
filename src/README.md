# Documentación Técnica: BetValuator Edge

## 1. Visión General y Objetivo

**BetValuator Edge** es una aplicación web construida con Next.js, React y Genkit, diseñada para inversores deportivos. Su objetivo principal es transformar las apuestas deportivas de un juego de azar a una disciplina de inversión cuantitativa. La aplicación proporciona a los usuarios un conjunto de herramientas analíticas para identificar "apuestas de valor" (value bets) donde las probabilidades del mercado no reflejan la probabilidad real de un resultado.

La aplicación se centra en un flujo de trabajo analítico, permitiendo a los usuarios analizar partidos de fútbol y tenis a través de diferentes metodologías, desde el raspado de datos y modelado estadístico hasta el análisis cualitativo asistido por IA.

## 2. Arquitectura Tecnológica

- **Frontend:** Next.js 15 (App Router), React 18, TypeScript.
- **UI/Estilos:** Tailwind CSS, ShadCN/UI para componentes preconstruidos (accesibles en `src/components/ui`). El tema de colores se define en `src/app/globals.css`.
- **Inteligencia Artificial (GenAI):** Google Genkit (a través del plugin `@genkit-ai/googleai`) para la interacción con modelos de lenguaje (LLMs). La configuración base de Genkit se encuentra en `src/ai/genkit.ts`.
- **Gestión de Formularios:** `react-hook-form` para la validación del lado del cliente.
- **Notificaciones:** `use-toast` (un hook personalizado) para mostrar mensajes de éxito o error.
- **Persistencia (Simulada):** Firebase Admin SDK (`src/lib/firebase-admin.ts`) para la lógica del lado del servidor, simulando la gestión de perfiles de usuario y cuotas de uso en Firestore.

## 3. Estructura del Código y Flujo de Datos

La aplicación se organiza en torno al `App Router` de Next.js, con una estructura clara que separa la lógica de la interfaz de usuario, las acciones del servidor y los flujos de IA.

### 3.1. Flujos de Genkit (`src/ai/flows/`)

Este es el núcleo de la inteligencia de la aplicación. Cada archivo representa un flujo de Genkit especializado que realiza una tarea específica. Los flujos son funciones del lado del servidor (`'use server';`) que pueden ser llamadas directamente desde los componentes del cliente a través de Server Actions.

- **`data-explorer-flow.ts`**:
  - **Función:** `dataExplorer`
  - **Propósito:** "R raspa" (extrae) estadísticas clave de un equipo desde una URL proporcionada (ej. FBref).
  - **Relación:** Es el primer paso en el `handleQuantitativeAnalysis`, alimentando con datos al `quantitative-model-flow`.

- **`quantitative-model-flow.ts`**:
  - **Función:** `quantitativeModel`
  - **Propósito:** Implementa un modelo predictivo (Poisson-xG). Recibe las estadísticas de dos equipos y los promedios de la liga para calcular las probabilidades de victoria local, empate y victoria visitante.
  - **Relación:** Recibe los datos del `data-explorer-flow` y sus resultados son enviados al `portfolio-manager-flow`.

- **`portfolio-manager-flow.ts`**:
  - **Función:** `portfolioManager`
  - **Propósito:** No es un flujo de IA, sino una función de lógica de negocio. Calcula el tamaño de la apuesta recomendada (`recommendedStake`) basándose en el capital del usuario (`bankroll`), las probabilidades del modelo, las cuotas del mercado y una estrategia de *staking* seleccionada (ej., Criterio de Kelly).
  - **Relación:** Es el último paso en el `handleQuantitativeAnalysis`, proporcionando la recomendación final de apuesta.

- **`calculate-value-bet-manual-flow.ts`**:
  - **Función:** `calculateValueBetManual`
  - **Propósito:** Permite un análisis fundamental. El usuario introduce manualmente datos estadísticos y cualitativos. El flujo utiliza la IA para generar un análisis textual y estimar probabilidades, y luego TypeScript calcula el valor esperado (EV).
  - **Relación:** Se invoca desde `handleFundamentalAnalysis` y es la lógica central para la pestaña "Fundamental Analysis".

- **`calculate-batch-value-bets-flow.ts`**:
  - **Función:** `calculateBatchValueBets`
  - **Propósito:** Orquesta un análisis masivo. Primero, usa `extract-matches-flow` para separar el texto en partidos individuales. Luego, invoca `analyze-single-match-flow` para cada partido en paralelo. También simula una verificación de cuotas de uso contra un perfil de usuario en Firestore.
  - **Relación:** Es la lógica para la pestaña "Batch Value Bet Finder".

- **`fetch-live-odds-flow.ts`**:
  - **Función:** `fetchLiveOdds`
  - **Propósito:** Se conecta a una API de terceros (The Odds API) para obtener cuotas de apuestas en tiempo real de múltiples casas de apuestas para un deporte específico.
  - **Relación:** Es llamado por la acción `handleFetchLiveOdds` para alimentar la pestaña de "Cuotas en Vivo".

### 3.2. Server Actions (`src/app/dashboard/analyze/actions.ts`)

Este archivo actúa como el puente entre el cliente y los flujos de Genkit del backend. Contiene las `Server Actions` que son llamadas por los formularios en la página de análisis.

- **`handleQuantitativeAnalysis`**: Orquesta el flujo de análisis cuantitativo completo:
  1.  Valida la entrada del formulario con Zod.
  2.  Llama a `dataExplorer` para ambos equipos.
  3.  Pasa los resultados a `quantitativeModel`.
  4.  Pasa las probabilidades del modelo y los datos del formulario a `portfolioManager`.
  5.  Devuelve los resultados estructurados al cliente para su visualización.

- **`handleFundamentalAnalysis`**: Maneja el formulario de análisis manual.
  1.  Valida la entrada con un `discriminatedUnion` de Zod para manejar diferentes deportes (fútbol, tenis).
  2.  Llama a `calculateValueBetManual`.
  3.  Formatea la salida para que el componente `ResultsDisplay` la pueda renderizar.

- **`handleCalculateBatchValueBets`**: Maneja el formulario de análisis por lotes, llamando al flujo correspondiente.

- **`handleFetchLiveOdds`**: Maneja el formulario de consulta de cuotas en vivo. Llama al flujo `fetchLiveOdds` y devuelve los datos al cliente.

### 3.3. Componentes de la Interfaz de Usuario (`src/app/dashboard/analyze/`)

La página principal de análisis (`page.tsx`) utiliza un menú desplegable para cambiar entre diferentes modos de análisis. Cada modo tiene su propio componente de formulario:

- **`quantitative-analysis-form.tsx`**: Formulario para el análisis cuantitativo. Llama a `handleQuantitativeAnalysis`.
- **`fundamental-analysis-form.tsx`**: Formulario para el análisis fundamental/manual. Llama a `handleFundamentalAnalysis`.
- **`batch-value-bets-form.tsx`**: Formulario para el análisis por lotes. Llama a `handleCalculateBatchValueBets`.
- **`single-match-analysis-form.tsx`**: Formulario para el análisis rápido de un solo partido.
- **`live-odds-form.tsx`**: Formulario para consultar cuotas en vivo. Llama a `handleFetchLiveOdds`.

Todos los formularios utilizan el hook `useActionState` de React para manejar el estado del formulario (pendiente, error, datos de respuesta) de forma asíncrona.

- **`results-display.tsx`**: Un componente crucial y reutilizable que recibe los datos de cualquiera de las `Server Actions` y los muestra en un formato unificado, incluyendo tablas de "Value Opportunities", recomendaciones de apuestas y análisis cualitativo.
- **`live-odds-results.tsx`**: Un componente especializado para mostrar los datos de cuotas en vivo en un formato de tabla claro y comparable.

### 3.4. Layout y Navegación (`src/app/dashboard/`)

- **`layout.tsx`**: Define la estructura visual principal para todas las páginas del dashboard, incluyendo la barra de navegación lateral persistente y el área de contenido principal. El estado activo del enlace se gestiona comparando el `pathname` actual con el `href` del enlace.
- **`page.tsx`**: La página de inicio del dashboard, que muestra una lista de análisis guardados (actualmente con datos de prueba).
- **`ledger/page.tsx`**: La página "Mis Apuestas", que muestra un historial de apuestas realizadas.
- **`settings/page.tsx`**: La página de configuración, que permite al usuario ajustar sus preferencias.

## 4. Flujo de Usuario Típico (Análisis Cuantitativo)

1.  **Navegación:** El usuario accede a `/dashboard/analyze`.
2.  **Entrada de Datos:** En el `QuantitativeAnalysisForm`, el usuario introduce los nombres de los equipos, las URLs de sus estadísticas (de FBref), los promedios de la liga y las cuotas del mercado.
3.  **Acción del Servidor:** Al enviar el formulario, se invoca la `Server Action` `handleQuantitativeAnalysis`.
4.  **Raspado de Datos:** La acción llama al flujo `dataExplorer` de Genkit para obtener las estadísticas de ambos equipos.
5.  **Modelado Predictivo:** Los datos extraídos se pasan al flujo `quantitativeModel`, que devuelve las probabilidades calculadas (ej. 55% victoria local).
6.  **Cálculo de Apuesta:** La acción combina estas probabilidades con las cuotas del mercado y el capital del usuario, y las pasa a la función `portfolioManager` para determinar el tamaño de la apuesta recomendada.
7.  **Visualización de Resultados:** La `Server Action` devuelve un objeto de estado con los resultados. El hook `useActionState` en el cliente recibe este estado y pasa los datos al componente `ResultsDisplay`, que renderiza las tablas de valor y las recomendaciones de forma clara y legible para el usuario.

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
  - **Relación:** Es llamado por la acción `handleFetchLiveOdds` y también por `get-matches-flow` para alimentar la pestaña de "Cuotas en Vivo" y el Explorador de Partidos.

- **`get-matches-flow.ts`**:
  - **Función:** `getMatches`
  - **Propósito:** Orquesta la obtención de partidos para el "Explorador de Partidos". Realiza llamadas en paralelo a `fetchLiveOdds` para múltiples ligas, combina los resultados y aplica lógica de filtrado, ordenación y paginación del lado del servidor.

### 3.2. Server Actions (`src/app/dashboard/analyze/actions.ts` y `src/app/dashboard/partidos/actions.ts`)

Estos archivos actúan como el puente entre el cliente y los flujos de Genkit del backend. Contienen las `Server Actions` que son llamadas por los formularios y componentes.

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

- **`fetchMatches` (`partidos/actions.ts`):** Esta acción es llamada por la página del Explorador de Partidos, pasando los filtros de la URL. Invoca al flujo `getMatches` para obtener la lista de partidos a mostrar.


### 3.3. Componentes de la Interfaz de Usuario (`src/app/dashboard/analyze/`)

La página principal de análisis (`page.tsx`) utiliza un menú desplegable para cambiar entre diferentes modos de análisis. Cada modo tiene su propio componente de formulario:

- **`quantitative-analysis-form.tsx`**: Formulario para el análisis cuantitativo.
- **`fundamental-analysis-form.tsx`**: Formulario para el análisis fundamental/manual.
- **`batch-value-bets-form.tsx`**: Formulario para el análisis por lotes.
- **`image-analysis-form.tsx`**: Formulario para el análisis desde una imagen.
- **`live-odds-form.tsx`**: Formulario para consultar cuotas en vivo.

- **`results-display.tsx`**: Un componente crucial y reutilizable que recibe los datos de cualquiera de las `Server Actions` de análisis y los muestra en un formato unificado.
- **`live-odds-results.tsx`**: Un componente especializado para mostrar los datos de cuotas en vivo en un formato de tabla claro y comparable.

### 3.4. Layout y Navegación (`src/app/dashboard/`)

- **`layout.tsx`**: Define la estructura visual principal para todas las páginas del dashboard, incluyendo la barra de navegación lateral persistente y el área de contenido principal. El estado activo del enlace se gestiona comparando el `pathname` actual con el `href` del enlace.
- **`page.tsx`**: La página de inicio del dashboard, que muestra una lista de análisis guardados.
- **`ledger/page.tsx`**: La página "Mis Apuestas", que muestra un historial de apuestas realizadas.
- **`settings/page.tsx`**: La página de configuración, que permite al usuario ajustar sus preferencias.


### 3.5. Explorador de Partidos (`src/app/dashboard/partidos/`)

Esta es una de las funcionalidades clave de la aplicación. Permite a los usuarios descubrir y filtrar partidos futuros con cuotas en tiempo real para identificar oportunidades de análisis.

- **`page.tsx`**: El componente principal de la página, construido como un **Server Component**. Es responsable de recibir los parámetros de filtro desde la URL (`searchParams`). Utiliza `Suspense` de React para mostrar un estado de carga (`loading.tsx`) mientras se obtienen los datos. Llama a la `Server Action` `fetchMatches` para obtener la lista de partidos.

- **`layout.tsx`**: Define el diseño de la página, colocando la `FilterSidebar` a la izquierda y el contenido principal (la tabla de partidos) a la derecha.

- **`_components/filter-sidebar.tsx`**: Es un **Client Component** que permite al usuario construir una consulta compleja. Incluye filtros por liga, rango de fechas, umbral de valor y cuotas. Cuando el usuario aplica los filtros, este componente actualiza los parámetros de la URL, lo que provoca que el Server Component `page.tsx` se vuelva a renderizar con los nuevos filtros.

- **`_components/data-table.tsx`**: Un **Client Component** reutilizable que muestra los partidos en una tabla interactiva. Se encarga de la paginación del lado del cliente y de gestionar la interacción con la tabla.

- **`_components/columns.tsx`**: Define la estructura y el renderizado de las columnas para la `MatchDataTable`, incluyendo cómo mostrar los equipos, las cuotas y las acciones.

- **Flujo de Datos del Explorador:**
  1. El usuario interactúa con los filtros en `FilterSidebar`.
  2. Al hacer clic en "Aplicar Filtros", se actualizan los `searchParams` en la URL.
  3. El Server Component `PartidosPage` detecta el cambio en `searchParams` y se vuelve a ejecutar.
  4. `PartidosPage` llama a la `Server Action` `fetchMatches` (en `partidos/actions.ts`), pasando los nuevos `searchParams`.
  5. La `Server Action` invoca al flujo de Genkit `getMatches`.
  6. El flujo `getMatches` realiza llamadas en paralelo a la API de `fetchLiveOdds` para las ligas seleccionadas, combina los resultados, aplica filtros adicionales y devuelve la lista de partidos paginada.
  7. Los datos se devuelven a `PartidosPage` y se renderizan en la `MatchDataTable`.
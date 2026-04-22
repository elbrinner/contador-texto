# Research: Arquitectura Inicial de la Aplicacion

## Decision 1: Aplicacion Angular con ruta unica y shell expandible

- **Decision**: La arquitectura inicial se implementara como una SPA Angular 21
  con una sola ruta principal (`/`) que renderiza un `analysis-shell` y deja la
  posibilidad de agregar rutas secundarias mas adelante sin reestructurar el
  arbol base.
- **Rationale**: El alcance aclarado exige un unico flujo principal. Mantener
  router con una ruta unica evita sobredisenar multiples superficies pero deja
  un punto de evolucion compatible con futuras vistas o ajustes de informacion.
- **Alternatives considered**: Eliminar por completo el router para simplificar
  aun mas; descartado porque dificulta ampliar la navegacion sin tocar la base.
  Modelar varias rutas principales desde el dia uno; descartado por introducir
  complejidad innecesaria al alcance actual.

## Decision 2: Estado reactivo en Signals con servicio de store dedicado

- **Decision**: El texto fuente y las metricas derivadas viviran en un servicio
  de store basado en Signals, con API de lectura/escritura limitada para los
  componentes visuales.
- **Rationale**: Esta separacion protege la UI de mezclar render con logica de
  dominio, hace explícita la direccion del flujo de datos y coincide con la
  constitucion del repositorio.
- **Alternatives considered**: Guardar todo el estado en el componente shell;
  descartado por mezclar composicion visual con reglas de negocio. Adoptar una
  libreria de estado externa; descartado por innecesaria para un solo flujo.

## Decision 3: Calculo de metricas en utilidades puras y servicio orquestador

- **Decision**: Las operaciones de normalizacion, tokenizacion aproximada y
  calculo de metricas se dividiran entre utilidades puras y un servicio de
  orquestacion que convierte esos resultados en modelos listos para UI.
- **Rationale**: Las funciones puras facilitan test unitario y evitan repetir
  reglas en multiples componentes. El servicio mantiene un borde claro entre el
  dominio de calculo y la representacion visual.
- **Alternatives considered**: Resolver los calculos dentro del store completo;
  descartado para no concentrar demasiadas responsabilidades. Resolver calculos
  en componentes; descartado por violar los limites arquitectonicos buscados.

## Decision 4: Layout responsive de dos paneles con degradacion a una columna

- **Decision**: La UI base se diseñara como shell de dos paneles en escritorio
  (entrada y resumen de metricas) y como una sola columna apilada en movil.
- **Rationale**: El producto exige lectura clara y analisis en tiempo real sin
  distracciones. La misma arquitectura visual cubre escritorio y movil sin
  obligar a crear superficies independientes.
- **Alternatives considered**: Mantener un layout fijo de escritorio;
  descartado por incumplir el alcance responsive. Crear layouts separados por
  dispositivo; descartado por duplicar complejidad desde la base.

## Decision 5: Sin persistencia ni backend en la primera arquitectura

- **Decision**: La arquitectura inicial no incluira backend, almacenamiento
  persistente ni sincronizacion remota; el flujo vive enteramente en memoria del
  navegador.
- **Rationale**: La feature busca definir estructura inicial de aplicacion, no
  flujos de durabilidad. Mantener el dominio en memoria reduce friccion para la
  primera entrega y conserva claridad sobre responsabilidades.
- **Alternatives considered**: LocalStorage para continuidad de texto;
  descartado porque agrega decisiones de ciclo de vida no requeridas aun.
  Backend desde el inicio; descartado por estar fuera del alcance.

## Decision 6: Validacion obligatoria y documentacion como parte del diseño

- **Decision**: El plan incorpora como artefactos obligatorios la validacion con
  `ng test`, `ng lint`, `ng build`, la revision visual en Simple Browser y la
  actualizacion de README/ADR/documentacion tecnica/release notes cuando cambie
  la arquitectura.
- **Rationale**: La constitucion hace de estos pasos un criterio de entrega, no
  un anexo. Diseñarlos desde ahora evita que queden relegados al final.
- **Alternatives considered**: Tratar validacion y documentacion como tareas de
  cierre fuera del diseño; descartado por debilitar la trazabilidad exigida.
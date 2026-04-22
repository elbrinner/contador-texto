# UI Architecture Contract: Arquitectura Inicial de la Aplicacion

## Purpose

Definir el contrato visible de la arquitectura inicial para que cualquier
implementacion futura mantenga el mismo reparto de responsabilidades entre shell,
entrada, calculo y presentacion.

## Route Contract

- La release inicial expone una sola ruta obligatoria: `/`.
- La ruta `/` renderiza un `analysis-shell` como contenedor de composicion.
- Cualquier nueva vista principal futura MUST agregarse por router y MUST
  documentar por que no cabe dentro del flujo principal existente.

## Composition Contract

- `analysis-shell` compone las superficies `text-input-panel` y
  `metrics-panel`.
- `text-input-panel` captura y emite cambios de texto; no calcula metricas.
- `metrics-panel` presenta resultados derivados; no normaliza ni tokeniza.
- Los paneles visuales MUST NOT importarse entre si de forma directa.

## State Ownership Contract

- Un servicio de store posee el texto fuente y los view models derivados.
- Los componentes leen estado expuesto como contratos de solo lectura.
- Los cambios de texto entran por un unico punto de escritura controlado por el
  store.

## Domain Computation Contract

- La normalizacion de texto, estimacion de tokens y calculo de metricas viven en
  `utils/` y/o en un servicio orquestador que las compone.
- Ninguna regla de calculo compleja puede vivir solo en la plantilla o en el
  componente visual.

## Extension Contract

- Una nueva metrica MUST entrar por `models/` + `utils/`/`services/` antes de
  aparecer en `components/`.
- Un nuevo layout o variante de presentacion MUST reutilizar el mismo flujo de
  datos base salvo que exista una decision arquitectonica documentada.
- Cambios que afecten composicion visual MUST incluir validacion en Simple
  Browser y actualizacion de README/ADR/documentacion tecnica/release notes.
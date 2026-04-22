# Data Model: Arquitectura Inicial de la Aplicacion

## Entity: ArchitecturalArea

- **Purpose**: Define una zona estable de responsabilidad dentro de la
  aplicacion.
- **Fields**:
  - `name`: `component` | `service` | `utility` | `model`
  - `purpose`: descripcion corta del tipo de responsabilidad que le pertenece
  - `ownsArtifacts`: lista de archivos o artefactos que esa area controla
  - `allowedDependencies`: areas desde las que puede consumir informacion
  - `forbiddenResponsibilities`: responsabilidades que no pueden residir ahi
- **Validation Rules**:
  - `name` MUST be unique across the architecture definition.
  - `purpose` MUST describe one dominant responsibility family.
  - `forbiddenResponsibilities` MUST include at least one anti-pattern for each area.
- **Relationships**:
  - Owns many `FlowStage` nodes.
  - Is referenced by many `EvolutionRule` records.

## Entity: FlowStage

- **Purpose**: Representa un paso del flujo principal desde captura de texto
  hasta presentacion de metricas.
- **Fields**:
  - `id`: identificador estable del paso
  - `order`: posicion secuencial dentro del flujo principal
  - `trigger`: evento que inicia el paso
  - `inputContract`: datos que recibe el paso
  - `outputContract`: datos que produce el paso
  - `ownerArea`: `ArchitecturalArea` responsable
  - `uiSurface`: superficie visual afectada, si aplica
- **Validation Rules**:
  - `order` MUST be contiguous and start at 1.
  - `ownerArea` MUST reference an existing `ArchitecturalArea`.
  - `inputContract` and `outputContract` MUST be describable without implementation-specific APIs.
- **Relationships**:
  - Belongs to one `ArchitecturalArea`.
  - Can be constrained by many `EvolutionRule` records.
- **State Transitions**:
  - `capture-input` -> `normalize-text` -> `compute-metrics` -> `present-results`

## Entity: EvolutionRule

- **Purpose**: Captura como puede crecer la arquitectura sin romper la base.
- **Fields**:
  - `id`: identificador estable
  - `scenario`: caso de cambio permitido, por ejemplo nueva metrica o nueva vista
  - `entryPoint`: area o paso que debe absorber el cambio primero
  - `constraint`: limite que el cambio no puede violar
  - `documentationImpact`: artefactos que deben actualizarse
  - `requiresVisualValidation`: boolean
- **Validation Rules**:
  - `scenario` MUST describe a realistic extension path.
  - `entryPoint` MUST map to an existing area or flow stage.
  - `documentationImpact` MUST not be empty for architecture changes.
- **Relationships**:
  - References one or more `ArchitecturalArea` records.
  - References zero or more `FlowStage` records.

## Entity: QualityGate

- **Purpose**: Define validaciones y revisiones que deben acompañar cambios arquitectonicos.
- **Fields**:
  - `name`: `ng test` | `ng lint` | `ng build` | `simple-browser-review` | `docs-update`
  - `trigger`: momento en que aplica
  - `owner`: rol responsable de ejecutarlo o verificarlo
  - `evidence`: prueba esperada del cumplimiento
- **Validation Rules**:
  - `name` MUST be one of the repository-approved gates.
  - `evidence` MUST be inspectable during review.
- **Relationships**:
  - Can be attached to many `EvolutionRule` records.

## Shared Notes

- `components/` consume estado y view models, pero no implementan calculos de
  metricas complejos.
- `services/` orquestan Signals y coordinan el flujo principal, pero delegan
  logica pura de calculo a `utils/`.
- `models/` definen contratos internos estables para no acoplar componentes a
  estructuras implícitas.
# Reglas de contribución — ASANO

> Reglas **obligatorias** de commits y branching. No se bypassean nunca — ni por
> cambios "chiquitos" ni por apuro. Aplican a cualquier persona (o asistente) que
> toque este repo.

---

## 1. Branching strategy

Usamos un flujo simple basado en ramas de trabajo + Pull Request (estilo *GitHub Flow*).

### Reglas

1. **`master` es sagrada.** Es la rama estable. **Nunca** se commitea ni se pushea directo a `master`.
2. **Todo cambio se hace en una rama** que sale de `master` actualizado.
3. **Una rama = una unidad de trabajo** (una feature, un fix, un bloque). No mezclar temas.
4. Para integrar a `master` **se abre un Pull Request** y se mergea desde ahí (deja registro y checkpoint). Trabajando en solitario, uno mismo puede revisar y mergear su PR.
5. **`master` siempre queda funcional**: el typecheck (`npx tsc --noEmit`) debe pasar antes de mergear.
6. **Se borra la rama** una vez mergeada.

### Nombres de rama

Formato: `tipo/descripcion-corta-en-kebab-case`

| Prefijo | Para |
|---------|------|
| `feat/` | funcionalidad nueva (ej. `feat/onboarding`) |
| `fix/` | corrección de bug (ej. `fix/racha-semanal`) |
| `docs/` | documentación |
| `chore/` | tareas de mantenimiento, config, deps (ej. `chore/git-workflow`) |
| `refactor/` | reestructurar sin cambiar comportamiento |
| `test/` | agregar o corregir tests |

---

## 2. Reglas de commits

Usamos **Conventional Commits**: un formato estándar que hace el historial legible y permite automatizar changelogs a futuro.

### Formato

```
tipo(alcance): resumen en imperativo

[cuerpo opcional: qué y por qué, no cómo]
```

- **tipo**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `build`.
- **alcance** (opcional): la zona afectada, ej. `onboarding`, `db`, `theme`.
- **resumen**: en imperativo, en español, **≤ 72 caracteres**, sin punto final.

### Ejemplos

```
feat(onboarding): agregar flujo de 6 preguntas y estilo de ASA
fix(db): evitar registro duplicado del mismo día
docs: actualizar stack tecnológico tras bloque 2
chore(deps): sumar expo-notifications
```

### Reglas

1. **Un commit = un cambio lógico coherente.** No mezclar cambios sin relación.
2. **No commitear código que no compila.** Correr `npx tsc --noEmit` antes.
3. Mensaje claro: al leer el historial se entiende qué cambió y por qué.
4. Los commits hechos por el asistente incluyen la línea `Co-Authored-By` correspondiente.

---

## 3. Flujo típico (checklist)

```bash
# 1. Partir de master actualizado
git checkout master && git pull

# 2. Crear la rama de trabajo
git checkout -b feat/mi-feature

# 3. Trabajar y commitear (con formato Conventional Commits)
git add -A
git commit -m "feat(alcance): descripción"

# 4. Verificar que compila
npx tsc --noEmit

# 5. Subir la rama y abrir PR
git push -u origin feat/mi-feature
#   → abrir Pull Request hacia master

# 6. Mergear el PR y limpiar
git checkout master && git pull
git branch -d feat/mi-feature
```

---

## 4. Qué NO hacer

- ❌ Commitear directo a `master`.
- ❌ Pushear con `--force` a `master`.
- ❌ Mezclar features distintas en una rama o en un commit.
- ❌ Mergear con el typecheck roto.
- ❌ Mensajes de commit vagos ("cambios", "wip", "arreglos").

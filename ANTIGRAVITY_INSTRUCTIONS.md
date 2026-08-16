# ANTIGRAVITY BUILD INSTRUCTIONS

This repository is an intentionally clean Next.js + React starter architecture for a two-character cooperative 2D puzzle platformer.

## NON-NEGOTIABLE

1. Keep Next.js + React.
2. Do not migrate to Vite or vanilla JS.
3. Do not replace the project with a different framework.
4. Use the Canvas/game-rendering layer for the actual gameplay simulation and rendering.
5. Keep React responsible for application UI and menus.
6. Keep level data separate from rendering.
7. Keep collision geometry separate from decorative artwork.
8. Create ORIGINAL art inspired by the desired visual direction. Do not copy copyrighted Fireboy & Watergirl sprites, logos, exact levels, or artwork.
9. Do not delete the architecture unless there is a concrete technical reason.
10. Build incrementally and keep the app runnable after each major change.

## FIRST TASK

Before implementing gameplay:
- inspect the whole repository
- explain the architecture
- identify placeholders
- propose the implementation sequence
- confirm that Next.js + React will remain the stack

## IMPLEMENTATION ORDER

1. Game loop
2. Input
3. Player entities
4. Physics
5. Collision
6. Hazards
7. Camera
8. Level data system
9. Pressure plates and switches
10. Doors
11. Moving platforms
12. Collectibles
13. Dual exits
14. Level completion
15. Menus and progression
16. Original sprites/assets
17. Animation and particles
18. Responsive/fullscreen handling
19. Performance audit
20. Final visual polish

## GAMEPLAY TARGET

Two simultaneously controllable characters:

FIRE
- W/A/D
- immune to fire/lava
- vulnerable to water and toxic hazards

WATER
- Arrow keys
- immune to water
- vulnerable to fire/lava and toxic hazards

The level completes only when both characters reach their correct exits.

## VISUAL TARGET

Aim for a polished dark fantasy/ancient-temple cooperative puzzle-platformer:
- stone architecture
- layered backgrounds
- readable platforms
- clear fire and water hazards
- glowing crystals
- subtle particles
- strong character silhouettes
- polished UI

Use supplied visual references only for high-level design direction. Generate/use original assets.

## DO NOT

Do not make every object a React div.
Do not put the entire game inside one component.
Do not hardcode every level inside JSX.
Do not use copied copyrighted game assets.
Do not rewrite the project from scratch without a reason.

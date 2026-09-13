import { createSpatialObject } from './model.js';

export const SANDBOX_SCENE = Object.freeze([
  createSpatialObject({
    id: 'normal-crate',
    label: 'NORMAL A',
    worldX: 290, worldY: 225, height: 18,
    pivot: [24, 30], groundContact: [24, 30],
    collisionFootprint: { x: -18, y: -10, w: 36, h: 20 },
    interactionFootprint: { x: -28, y: -20, w: 56, h: 40 },
    depthLayer: 'structure', color: '#9a6f45'
  }),
  createSpatialObject({
    id: 'normal-barrel',
    label: 'NORMAL B',
    worldX: 545, worldY: 270, height: 24,
    pivot: [18, 28], groundContact: [18, 28],
    collisionFootprint: { x: -12, y: -10, w: 24, h: 20 },
    interactionFootprint: { x: -22, y: -20, w: 44, h: 40 },
    depthLayer: 'structure', color: '#a34f3a'
  }),
  createSpatialObject({
    id: 'normal-pipe',
    label: 'NORMAL C',
    worldX: 780, worldY: 210, height: 20,
    pivot: [38, 22], groundContact: [38, 22],
    collisionFootprint: { x: -26, y: -8, w: 52, h: 16 },
    interactionFootprint: { x: -36, y: -18, w: 72, h: 36 },
    depthLayer: 'structure', color: '#4e8a82'
  }),
  createSpatialObject({
    id: 'tall-wall',
    label: 'TALL WALL',
    worldX: 400, worldY: 390, visualZ: 0, height: 115,
    pivot: [110, 115], groundContact: [110, 115],
    collisionFootprint: { x: -100, y: -12, w: 200, h: 24 },
    interactionFootprint: { x: -110, y: -24, w: 220, h: 48 },
    depthLayer: 'structure', color: '#69706a'
  }),
  createSpatialObject({
    id: 'foreground-fence',
    label: 'FOREGROUND',
    worldX: 700, worldY: 410, height: 76,
    pivot: [150, 76], groundContact: [150, 76],
    collisionFootprint: { x: -140, y: -8, w: 280, h: 16 },
    interactionFootprint: { x: -150, y: -20, w: 300, h: 40 },
    depthLayer: 'foreground', depthBias: 80, color: '#cf9a51'
  }),
  createSpatialObject({
    id: 'elevated-platform',
    label: 'ELEVATED PLATFORM',
    worldX: 900, worldY: 300, visualZ: 54, height: 26,
    pivot: [105, 26], groundContact: [105, 26],
    collisionFootprint: { x: -95, y: -10, w: 190, h: 20 },
    interactionFootprint: { x: -105, y: -22, w: 210, h: 44 },
    depthLayer: 'structure', color: '#836c9b'
  }),
  createSpatialObject({
    id: 'bridge-under',
    label: 'BRIDGE UNDER',
    worldX: 1050, worldY: 250, height: 90,
    pivot: [130, 90], groundContact: [130, 90],
    collisionFootprint: { x: -115, y: -10, w: 230, h: 20 },
    interactionFootprint: { x: -125, y: -22, w: 250, h: 44 },
    depthLayer: 'structure', color: '#625a52'
  }),
  createSpatialObject({
    id: 'bridge-over',
    label: 'BRIDGE OVER',
    worldX: 1050, worldY: 250, visualZ: 65, height: 70,
    pivot: [130, 70], groundContact: [130, 70],
    collisionFootprint: { x: -115, y: -8, w: 230, h: 16 },
    interactionFootprint: { x: -125, y: -20, w: 250, h: 40 },
    depthLayer: 'foreground', depthBias: 80, color: '#9b7957'
  }),
  createSpatialObject({
    id: 'actor-ground',
    label: 'ACTOR GROUND',
    worldX: 235, worldY: 210, height: 48,
    pivot: [14, 48], groundContact: [14, 48],
    collisionFootprint: { x: -10, y: -8, w: 20, h: 16 },
    interactionFootprint: { x: -20, y: -18, w: 40, h: 36 },
    depthLayer: 'actor', color: '#d8d5b0'
  }),
  createSpatialObject({
    id: 'actor-elevated',
    label: 'ACTOR ELEVATED',
    worldX: 900, worldY: 300, visualZ: 54, height: 52,
    pivot: [14, 52], groundContact: [14, 52],
    collisionFootprint: { x: -10, y: -8, w: 20, h: 16 },
    interactionFootprint: { x: -20, y: -18, w: 40, h: 36 },
    depthLayer: 'actor', color: '#f0d56d'
  }),
  createSpatialObject({
    id: 'actor-under-bridge',
    label: 'ACTOR UNDER',
    worldX: 1050, worldY: 250, height: 50,
    pivot: [14, 50], groundContact: [14, 50],
    collisionFootprint: { x: -10, y: -8, w: 20, h: 16 },
    interactionFootprint: { x: -20, y: -18, w: 40, h: 36 },
    depthLayer: 'actor', color: '#80c7c2'
  }),
  createSpatialObject({
    id: 'actor-front',
    label: 'ACTOR FRONT',
    worldX: 700, worldY: 410, height: 50,
    pivot: [14, 50], groundContact: [14, 50],
    collisionFootprint: { x: -10, y: -8, w: 20, h: 16 },
    interactionFootprint: { x: -20, y: -18, w: 40, h: 36 },
    depthLayer: 'actor', depthBias: 100, color: '#f1a35c'
  }),
  createSpatialObject({
    id: 'actor-behind-wall',
    label: 'ACTOR BEHIND WALL',
    worldX: 400, worldY: 370, height: 50,
    pivot: [14, 50], groundContact: [14, 50],
    collisionFootprint: { x: -10, y: -8, w: 20, h: 16 },
    interactionFootprint: { x: -20, y: -18, w: 40, h: 36 },
    depthLayer: 'actor', color: '#d7a6e8'
  })
]);

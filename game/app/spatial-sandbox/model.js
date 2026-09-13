const LAYER_ORDER = Object.freeze({
  ground: 0,
  structure: 10,
  actor: 20,
  foreground: 30
});

export function createSpatialObject(definition) {
  if (!definition?.id) throw new Error('Spatial test object requires an id');
  const pivot = definition.pivot || [0, 0];
  const groundContact = definition.groundContact || [0, 0];
  return Object.freeze({
    ...definition,
    worldX: Number(definition.worldX || 0),
    worldY: Number(definition.worldY || 0),
    visualZ: Number(definition.visualZ || 0),
    height: Number(definition.height || 0),
    pivot: [Number(pivot[0]), Number(pivot[1])],
    groundContact: [Number(groundContact[0]), Number(groundContact[1])],
    collisionFootprint: {
      x: Number(definition.collisionFootprint?.x || 0),
      y: Number(definition.collisionFootprint?.y || 0),
      w: Number(definition.collisionFootprint?.w || 0),
      h: Number(definition.collisionFootprint?.h || 0)
    },
    interactionFootprint: {
      x: Number(definition.interactionFootprint?.x || 0),
      y: Number(definition.interactionFootprint?.y || 0),
      w: Number(definition.interactionFootprint?.w || 0),
      h: Number(definition.interactionFootprint?.h || 0)
    },
    depthBias: Number(definition.depthBias || 0),
    depthLayer: definition.depthLayer || 'actor'
  });
}

export function depthKey(object) {
  return object.worldY + object.visualZ * 0.35 + (LAYER_ORDER[object.depthLayer] || 0) + object.depthBias;
}

export function sortSpatialObjects(objects) {
  return [...objects].sort((a, b) => depthKey(a) - depthKey(b) || a.id.localeCompare(b.id));
}

export function visualPlacement(object) {
  return {
    x: object.worldX + object.groundContact[0] - object.pivot[0],
    y: object.worldY + object.groundContact[1] - object.visualZ - object.pivot[1]
  };
}

export function collisionBounds(object) {
  const footprint = object.collisionFootprint;
  return {
    x: object.worldX + footprint.x,
    y: object.worldY + footprint.y,
    w: footprint.w,
    h: footprint.h
  };
}

export function intersectsCollision(a, b) {
  const first = collisionBounds(a);
  const second = collisionBounds(b);
  return first.x < second.x + second.w &&
    first.x + first.w > second.x &&
    first.y < second.y + second.h &&
    first.y + first.h > second.y;
}

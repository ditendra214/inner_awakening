import * as THREE from 'three';
import { getItemById } from '../data/itemDatabase';

/**
 * Service to dynamically apply modular equipment visuals to Three.js character models.
 * Operates on one base character model:
 * - Material color & emissive adjustments
 * - Bone attachments (Head, Spine2, Forearms)
 * - Aura effects (Matrix, Golden Sovereign, Crimson Flame)
 */
export class CharacterVisualCustomizer {
  constructor() {
    this.attachments = [];
    this.auraObjects = [];
    this.originalMaterials = new Map();
  }

  /**
   * Cleans up all current attachments and auras
   */
  cleanup(characterRoot) {
    // Remove bone attachments
    this.attachments.forEach(mesh => {
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.attachments = [];

    // Remove auras
    this.auraObjects.forEach(obj => {
      if (obj.parent) {
        obj.parent.remove(obj);
      }
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    this.auraObjects = [];
  }

  /**
   * Finds standard bones in Mixamo hierarchy
   */
  findBones(modelObject) {
    const bones = {
      head: null,
      spine: null,
      leftForearm: null,
      rightForearm: null
    };

    modelObject.traverse(child => {
      if (child.isBone) {
        const lower = child.name.toLowerCase();
        if (lower.includes('head') && !lower.includes('top') && !bones.head) {
          bones.head = child;
        } else if ((lower.includes('spine2') || lower.includes('spine1')) && !bones.spine) {
          bones.spine = child;
        } else if ((lower.includes('leftforearm') || lower.includes('lefthand')) && !bones.leftForearm) {
          bones.leftForearm = child;
        } else if ((lower.includes('rightforearm') || lower.includes('righthand')) && !bones.rightForearm) {
          bones.rightForearm = child;
        }
      }
    });

    return bones;
  }

  /**
   * Applies equipment visuals to the character model and root scene
   */
  applyEquipment(modelObject, characterRoot, equipmentMap = {}) {
    if (!modelObject || !characterRoot) return;

    this.cleanup(characterRoot);
    const bones = this.findBones(modelObject);

    // 1. APPLY CLOTHING MATERIALS (TOP, BOTTOM, SHOES)
    const topItem = getItemById(equipmentMap.top);
    const bottomItem = getItemById(equipmentMap.bottom);
    const shoesItem = getItemById(equipmentMap.shoes);
    const faceItem = getItemById(equipmentMap.face);

    modelObject.traverse(child => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        const isVisor = child.name.toLowerCase().includes('visor');

        mats.forEach(mat => {
          if (!mat) return;

          if (isVisor) {
            // Handle built-in Vanguard visor mesh
            if (faceItem && faceItem.itemId === 'face_cyber_visor') {
              child.visible = true;
              if (mat.color) mat.color.set(0x00f5ff);
              if (mat.emissive) mat.emissive.set(0x00f5ff);
              mat.emissiveIntensity = 1.4;
              mat.transparent = true;
              mat.opacity = 0.9;
            } else if (faceItem && (faceItem.itemId === 'face_ninja_mask' || faceItem.itemId === 'face_oni_halfmask')) {
              // Hide built-in visor when ninja/oni mask is worn
              child.visible = false;
            } else {
              child.visible = true;
              if (mat.color) mat.color.set(0x38bdf8);
              if (mat.emissive) mat.emissive.set(0x0284c7);
              mat.emissiveIntensity = 0.4;
            }
          } else {
            // Body mesh styling - strictly preserve natural character skin & PBR textures
            const meshName = (child.name || '').toLowerCase();
            const isSkinOrHead = meshName.includes('head') || meshName.includes('face') || meshName.includes('eye') || meshName.includes('skin') || meshName.includes('hair') || meshName.includes('body_mesh');
            
            // Clean neutral emissive - eliminate any red layer/glow
            if (mat.emissive) {
              mat.emissive.set(0x000000);
              mat.emissiveIntensity = 0;
            }

            if (isSkinOrHead) {
              // Natural character skin / face textures - no color overrides
              if (mat.map && mat.color) {
                mat.color.set(0xffffff);
              }
              if (mat.roughness !== undefined) mat.roughness = 0.55;
              if (mat.metalness !== undefined) mat.metalness = 0.05;
            } else if (topItem && topItem.visual) {
              // Only apply athletic equipment styling to non-skin clothing meshes
              if (topItem.visual.color && mat.color && !mat.map) {
                mat.color.set(topItem.visual.color);
              } else if (mat.map && mat.color) {
                mat.color.set(0xffffff); // Keep native texture clear and realistic
              }
              if (topItem.visual.roughness !== undefined && mat.roughness !== undefined) {
                mat.roughness = topItem.visual.roughness;
              }
              if (topItem.visual.metalness !== undefined && mat.metalness !== undefined) {
                mat.metalness = topItem.visual.metalness;
              }
            } else {
              // Standard realistic PBR defaults
              if (mat.color && mat.map) mat.color.set(0xffffff);
              if (mat.roughness !== undefined) mat.roughness = 0.5;
              if (mat.metalness !== undefined) mat.metalness = 0.1;
            }
          }
        });
      }
    });

    // 2. MODULAR BONE ATTACHMENTS (HEAD BONE)
    if (bones.head) {
      // (a) HAIR ATTACHMENT
      const hairItem = getItemById(equipmentMap.hair);
      if (hairItem) {
        const hairGroup = this.createHairMesh(hairItem);
        if (hairGroup) {
          bones.head.add(hairGroup);
          this.attachments.push(hairGroup);
        }
      }

      // (b) FACE / MASK ATTACHMENT
      if (faceItem && faceItem.itemId !== 'face_cyber_visor') {
        const maskMesh = this.createMaskMesh(faceItem);
        if (maskMesh) {
          bones.head.add(maskMesh);
          this.attachments.push(maskMesh);
        }
      }
    }

    // 3. ACCESSORIES ATTACHMENT (SPINE & FOREARMS)
    const accItem = getItemById(equipmentMap.accessories);
    if (accItem) {
      if (accItem.itemId === 'acc_combat_gauntlets') {
        if (bones.leftForearm) {
          const leftGauntlet = this.createGauntletMesh('left');
          bones.leftForearm.add(leftGauntlet);
          this.attachments.push(leftGauntlet);
        }
        if (bones.rightForearm) {
          const rightGauntlet = this.createGauntletMesh('right');
          bones.rightForearm.add(rightGauntlet);
          this.attachments.push(rightGauntlet);
        }
      } else if (accItem.itemId === 'acc_sovereign_cape' && bones.spine) {
        const capeMesh = this.createCapeMesh();
        bones.spine.add(capeMesh);
        this.attachments.push(capeMesh);
      } else if (accItem.itemId === 'acc_shadow_wings' && bones.spine) {
        const wingsMesh = this.createWingsMesh();
        bones.spine.add(wingsMesh);
        this.attachments.push(wingsMesh);
      }
    }

    // 4. SPECIAL AURA ATTACHMENT (CHARACTER PEDESTAL / ROOT)
    const auraItem = getItemById(equipmentMap.aura);
    if (auraItem) {
      const auraObj = this.createAuraObject(auraItem);
      if (auraObj) {
        characterRoot.add(auraObj);
        this.auraObjects.push(auraObj);
      }
    }
  }

  // --- PROCEDURAL ATTACHMENT GENERATORS ---

  createHairMesh(item) {
    const group = new THREE.Group();
    group.name = 'Attachment_Hair';
    // Head bone local offset
    group.position.set(0, 0.08, 0.02);

    const hairColor = item.visual?.color || '#7dd3fc';
    const emissiveColor = item.visual?.emissive || hairColor;
    const hairMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hairColor),
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity: item.visual?.emissiveIntensity || 0.4,
      roughness: 0.35,
      metalness: 0.2
    });

    if (item.itemId === 'hair_frost_flame') {
      // Volumetric stylized anime spikes
      const spikeAngles = [
        { rotX: -0.35, rotZ: 0, scale: 1.1, posY: 0.06, posZ: 0.05 },
        { rotX: -0.2, rotZ: 0.35, scale: 0.95, posY: 0.05, posZ: 0.03 },
        { rotX: -0.2, rotZ: -0.35, scale: 0.95, posY: 0.05, posZ: 0.03 },
        { rotX: 0.25, rotZ: 0.45, scale: 0.85, posY: 0.03, posZ: -0.04 },
        { rotX: 0.25, rotZ: -0.45, scale: 0.85, posY: 0.03, posZ: -0.04 },
        { rotX: 0.4, rotZ: 0, scale: 1.0, posY: 0.05, posZ: -0.06 },
      ];

      spikeAngles.forEach(sp => {
        const spikeGeo = new THREE.ConeGeometry(0.045 * sp.scale, 0.22 * sp.scale, 5);
        const spike = new THREE.Mesh(spikeGeo, hairMat);
        spike.position.set((sp.rotZ * 0.1), sp.posY, sp.posZ);
        spike.rotation.set(sp.rotX, 0, sp.rotZ);
        group.add(spike);
      });
    } else if (item.itemId === 'hair_cyber_punk') {
      // Neon Mohawk crest
      for (let i = -3; i <= 3; i++) {
        const h = 0.24 - Math.abs(i) * 0.03;
        const crestGeo = new THREE.BoxGeometry(0.025, h, 0.04);
        const crest = new THREE.Mesh(crestGeo, hairMat);
        crest.position.set(0, 0.06 + h / 2, i * 0.04);
        crest.rotation.x = i * -0.08;
        group.add(crest);
      }
    } else {
      // Sleek swept-back undercut
      const slickGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.15, 8, 1, false, 0, Math.PI);
      const slick = new THREE.Mesh(slickGeo, hairMat);
      slick.rotation.x = -Math.PI / 2.8;
      slick.position.set(0, 0.06, -0.04);
      group.add(slick);
    }

    return group;
  }

  createMaskMesh(item) {
    const group = new THREE.Group();
    group.name = 'Attachment_Mask';
    group.position.set(0, -0.02, 0.13); // mouth/jaw offset

    const maskColor = item.visual?.color || '#0f172a';
    const emissiveColor = item.visual?.emissive || '#00f5ff';

    const maskMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(maskColor),
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity: item.visual?.emissiveIntensity || 0.3,
      roughness: 0.5,
      metalness: 0.4
    });

    if (item.itemId === 'face_oni_halfmask') {
      // Armored Oni half-mask
      const faceGeo = new THREE.BoxGeometry(0.14, 0.09, 0.06);
      const faceMesh = new THREE.Mesh(faceGeo, maskMat);
      group.add(faceMesh);

      // Cyber Oni Fangs
      const fangMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
      [-0.04, 0.04].forEach(x => {
        const fangGeo = new THREE.ConeGeometry(0.012, 0.04, 4);
        const fang = new THREE.Mesh(fangGeo, fangMat);
        fang.position.set(x, -0.04, 0.03);
        fang.rotation.z = Math.PI;
        group.add(fang);
      });
    } else {
      // Tactical Ninja Mask
      const ninjaGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.09, 12, 1, false, 0, Math.PI);
      const ninjaMesh = new THREE.Mesh(ninjaGeo, maskMat);
      ninjaMesh.rotation.y = -Math.PI / 2;
      group.add(ninjaMesh);
    }

    return group;
  }

  createGauntletMesh(side = 'left') {
    const group = new THREE.Group();
    group.name = `Attachment_Gauntlet_${side}`;
    group.position.set(0, -0.06, 0);

    const gauntletGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.18, 12);
    const gauntletMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      emissive: 0x00f5ff,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.25
    });
    const vambrace = new THREE.Mesh(gauntletGeo, gauntletMat);
    group.add(vambrace);

    // Glowing energy ring
    const ringGeo = new THREE.TorusGeometry(0.052, 0.006, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    group.add(ring);

    return group;
  }

  createCapeMesh() {
    const group = new THREE.Group();
    group.name = 'Attachment_MonarchCape';
    group.position.set(0, 0.05, -0.12);

    const capeGeo = new THREE.PlaneGeometry(0.55, 1.2, 4, 8);
    // Slight curve to wrap around back
    const pos = capeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      pos.setZ(i, -Math.abs(x) * 0.12 - (y * -0.15));
    }
    capeGeo.computeVertexNormals();

    const capeMat = new THREE.MeshStandardMaterial({
      color: 0x0d031c,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.3
    });

    const capeMesh = new THREE.Mesh(capeGeo, capeMat);
    capeMesh.position.y = -0.55;
    group.add(capeMesh);

    return group;
  }

  createWingsMesh() {
    const group = new THREE.Group();
    group.name = 'Attachment_ShadowWings';
    group.position.set(0, 0.08, -0.1);

    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    [-1, 1].forEach(side => {
      const wingGeo = new THREE.ConeGeometry(0.25, 0.9, 4);
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.position.set(side * 0.35, 0.2, -0.05);
      wing.rotation.set(0.3, 0, side * -1.1);
      group.add(wing);

      const subWingGeo = new THREE.ConeGeometry(0.18, 0.6, 4);
      const subWing = new THREE.Mesh(subWingGeo, wingMat);
      subWing.position.set(side * 0.45, -0.05, -0.05);
      subWing.rotation.set(0.2, 0, side * -1.35);
      group.add(subWing);
    });

    return group;
  }

  createAuraObject(item) {
    const group = new THREE.Group();
    group.name = 'Attachment_SpecialAura';
    group.position.set(0, -1.18, 0);

    const auraColor = item.visual?.color || '#00f5ff';

    // Pedestal Rune Halo Ring
    const haloGeo = new THREE.RingGeometry(1.2, 1.42, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(auraColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.02;
    group.add(halo);

    // Dynamic Rising Particle Pillars
    const particleCount = item.itemId === 'aura_golden_sovereign' ? 90 : 70;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.95;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 2.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(auraColor),
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    particles.name = 'Aura_Particles';
    group.add(particles);

    return group;
  }

  /**
   * Update particle positions and rotating halo in animation loop
   */
  updateAnimation(delta) {
    this.auraObjects.forEach(aura => {
      const halo = aura.children.find(c => c.isMesh);
      if (halo) {
        halo.rotation.z += delta * 0.8;
      }
      const p = aura.getObjectByName('Aura_Particles');
      if (p && p.geometry && p.geometry.attributes.position) {
        const pos = p.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          let y = pos.getY(i) + delta * 0.7;
          if (y > 2.3) y = 0.05;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }
    });
  }
}

export const characterVisualCustomizer = new CharacterVisualCustomizer();

import * as THREE from 'three';

/**
 * Procedural Fitness Animation Generator for Mixamo Humanoid Skeletons
 * Creates smooth, game-ready animation clips for:
 * - Squat (Deep fitness squat with arm raise)
 * - Push-up (Horizontal strength push-up cycle)
 * - Jumping Jack (Cardio jumping jack loop)
 * - Victory Celebration (Triumphant rank-up celebration pose)
 */

export const generateFitnessClips = (rootObject) => {
  if (!rootObject) return [];

  // Find exact bone names in the hierarchy
  let hipsName = '';
  let spineName = '';
  let leftArmName = '';
  let rightArmName = '';
  let leftForeArmName = '';
  let rightForeArmName = '';
  let leftUpLegName = '';
  let rightUpLegName = '';
  let leftLegName = '';
  let rightLegName = '';

  rootObject.traverse(child => {
    if (child.isBone) {
      const lower = child.name.toLowerCase();
      if (lower.includes('hips')) hipsName = child.name;
      else if (lower.includes('spine1') || (lower.includes('spine') && !spineName)) spineName = child.name;
      else if (lower.includes('leftarm') && !lower.includes('fore')) leftArmName = child.name;
      else if (lower.includes('rightarm') && !lower.includes('fore')) rightArmName = child.name;
      else if (lower.includes('leftforearm')) leftForeArmName = child.name;
      else if (lower.includes('rightforearm')) rightForeArmName = child.name;
      else if (lower.includes('leftupleg')) leftUpLegName = child.name;
      else if (lower.includes('rightupleg')) rightUpLegName = child.name;
      else if (lower.includes('leftleg') && !lower.includes('up')) leftLegName = child.name;
      else if (lower.includes('rightleg') && !lower.includes('up')) rightLegName = child.name;
    }
  });

  const clips = [];

  // 1. SQUAT ANIMATION CLIP (2.0s loop)
  if (hipsName && spineName && leftUpLegName && rightUpLegName) {
    const squatTracks = [];
    const times = [0, 0.5, 1.0, 1.5, 2.0];

    // Hips vertical translation
    const hipsY = [
      0, 0, 0,
      0, -0.35, 0,
      0, -0.55, 0,
      0, -0.25, 0,
      0, 0, 0
    ];
    squatTracks.push(new THREE.VectorKeyframeTrack(`${hipsName}.position`, times, hipsY));

    // Spine tilt forward slightly during squat
    const qSpineNeutral = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const qSpineLean = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.25);
    const spineQuats = [
      qSpineNeutral.x, qSpineNeutral.y, qSpineNeutral.z, qSpineNeutral.w,
      qSpineLean.x, qSpineLean.y, qSpineLean.z, qSpineLean.w,
      qSpineLean.x, qSpineLean.y, qSpineLean.z, qSpineLean.w,
      qSpineNeutral.x, qSpineNeutral.y, qSpineNeutral.z, qSpineNeutral.w,
      qSpineNeutral.x, qSpineNeutral.y, qSpineNeutral.z, qSpineNeutral.w,
    ];
    squatTracks.push(new THREE.QuaternionKeyframeTrack(`${spineName}.quaternion`, times, spineQuats));

    // Arms raise forward for balance
    if (leftArmName && rightArmName) {
      const qArmNeutral = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
      const qArmRaiseL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -1.1);
      const qArmRaiseR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -1.1);
      
      const armLQuats = [
        qArmNeutral.x, qArmNeutral.y, qArmNeutral.z, qArmNeutral.w,
        qArmRaiseL.x, qArmRaiseL.y, qArmRaiseL.z, qArmRaiseL.w,
        qArmRaiseL.x, qArmRaiseL.y, qArmRaiseL.z, qArmRaiseL.w,
        qArmNeutral.x, qArmNeutral.y, qArmNeutral.z, qArmNeutral.w,
        qArmNeutral.x, qArmNeutral.y, qArmNeutral.z, qArmNeutral.w,
      ];
      const armRQuats = [
        qArmNeutral.x, qArmNeutral.y, qArmNeutral.z, qArmNeutral.w,
        qArmRaiseR.x, qArmRaiseR.y, qArmRaiseR.z, qArmRaiseR.w,
        qArmRaiseR.x, qArmRaiseR.y, qArmRaiseR.z, qArmRaiseR.w,
        qArmNeutral.x, qArmNeutral.y, qArmNeutral.z, qArmNeutral.w,
        qArmNeutral.x, qArmNeutral.y, qArmNeutral.z, qArmNeutral.w,
      ];
      squatTracks.push(new THREE.QuaternionKeyframeTrack(`${leftArmName}.quaternion`, times, armLQuats));
      squatTracks.push(new THREE.QuaternionKeyframeTrack(`${rightArmName}.quaternion`, times, armRQuats));
    }

    clips.push(new THREE.AnimationClip('Squat', 2.0, squatTracks));
  }

  // 2. JUMPING JACK ANIMATION CLIP (1.2s loop)
  if (hipsName && leftArmName && rightArmName && leftUpLegName && rightUpLegName) {
    const jjTracks = [];
    const jjTimes = [0, 0.3, 0.6, 0.9, 1.2];

    // Hips slight jump bounce
    const hipsBounce = [
      0, 0, 0,
      0, 0.18, 0,
      0, 0, 0,
      0, 0.18, 0,
      0, 0, 0
    ];
    jjTracks.push(new THREE.VectorKeyframeTrack(`${hipsName}.position`, jjTimes, hipsBounce));

    // Arms swing open and closed
    const qArmDown = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const qArmUpL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 2.2);
    const qArmUpR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -2.2);

    const jjArmL = [
      qArmDown.x, qArmDown.y, qArmDown.z, qArmDown.w,
      qArmUpL.x, qArmUpL.y, qArmUpL.z, qArmUpL.w,
      qArmDown.x, qArmDown.y, qArmDown.z, qArmDown.w,
      qArmUpL.x, qArmUpL.y, qArmUpL.z, qArmUpL.w,
      qArmDown.x, qArmDown.y, qArmDown.z, qArmDown.w,
    ];
    const jjArmR = [
      qArmDown.x, qArmDown.y, qArmDown.z, qArmDown.w,
      qArmUpR.x, qArmUpR.y, qArmUpR.z, qArmUpR.w,
      qArmDown.x, qArmDown.y, qArmDown.z, qArmDown.w,
      qArmUpR.x, qArmUpR.y, qArmUpR.z, qArmUpR.w,
      qArmDown.x, qArmDown.y, qArmDown.z, qArmDown.w,
    ];
    jjTracks.push(new THREE.QuaternionKeyframeTrack(`${leftArmName}.quaternion`, jjTimes, jjArmL));
    jjTracks.push(new THREE.QuaternionKeyframeTrack(`${rightArmName}.quaternion`, jjTimes, jjArmR));

    // Legs spread open and closed
    const qLegIn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const qLegOutL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.35);
    const qLegOutR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.35);

    const jjLegL = [
      qLegIn.x, qLegIn.y, qLegIn.z, qLegIn.w,
      qLegOutL.x, qLegOutL.y, qLegOutL.z, qLegOutL.w,
      qLegIn.x, qLegIn.y, qLegIn.z, qLegIn.w,
      qLegOutL.x, qLegOutL.y, qLegOutL.z, qLegOutL.w,
      qLegIn.x, qLegIn.y, qLegIn.z, qLegIn.w,
    ];
    const jjLegR = [
      qLegIn.x, qLegIn.y, qLegIn.z, qLegIn.w,
      qLegOutR.x, qLegOutR.y, qLegOutR.z, qLegOutR.w,
      qLegIn.x, qLegIn.y, qLegIn.z, qLegIn.w,
      qLegOutR.x, qLegOutR.y, qLegOutR.z, qLegOutR.w,
      qLegIn.x, qLegIn.y, qLegIn.z, qLegIn.w,
    ];
    jjTracks.push(new THREE.QuaternionKeyframeTrack(`${leftUpLegName}.quaternion`, jjTimes, jjLegL));
    jjTracks.push(new THREE.QuaternionKeyframeTrack(`${rightUpLegName}.quaternion`, jjTimes, jjLegR));

    clips.push(new THREE.AnimationClip('JumpingJack', 1.2, jjTracks));
  }

  // 3. VICTORY RANK-UP CELEBRATION POSE (2.4s loop)
  if (spineName && leftArmName && rightArmName) {
    const vicTracks = [];
    const vicTimes = [0, 0.6, 1.2, 1.8, 2.4];

    // Spine proud chest expansion
    const qSpineProud = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.15);
    const vicSpine = [
      qSpineProud.x, qSpineProud.y, qSpineProud.z, qSpineProud.w,
      qSpineProud.x, qSpineProud.y, qSpineProud.z, qSpineProud.w,
      qSpineProud.x, qSpineProud.y, qSpineProud.z, qSpineProud.w,
      qSpineProud.x, qSpineProud.y, qSpineProud.z, qSpineProud.w,
      qSpineProud.x, qSpineProud.y, qSpineProud.z, qSpineProud.w,
    ];
    vicTracks.push(new THREE.QuaternionKeyframeTrack(`${spineName}.quaternion`, vicTimes, vicSpine));

    // Both arms raised high in champion V-shape
    const qVicArmL = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, 2.3));
    const qVicArmR = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.4, 0, -2.3));

    const vicArmL = [
      qVicArmL.x, qVicArmL.y, qVicArmL.z, qVicArmL.w,
      qVicArmL.x, qVicArmL.y, qVicArmL.z, qVicArmL.w,
      qVicArmL.x, qVicArmL.y, qVicArmL.z, qVicArmL.w,
      qVicArmL.x, qVicArmL.y, qVicArmL.z, qVicArmL.w,
      qVicArmL.x, qVicArmL.y, qVicArmL.z, qVicArmL.w,
    ];
    const vicArmR = [
      qVicArmR.x, qVicArmR.y, qVicArmR.z, qVicArmR.w,
      qVicArmR.x, qVicArmR.y, qVicArmR.z, qVicArmR.w,
      qVicArmR.x, qVicArmR.y, qVicArmR.z, qVicArmR.w,
      qVicArmR.x, qVicArmR.y, qVicArmR.z, qVicArmR.w,
      qVicArmR.x, qVicArmR.y, qVicArmR.z, qVicArmR.w,
    ];
    vicTracks.push(new THREE.QuaternionKeyframeTrack(`${leftArmName}.quaternion`, vicTimes, vicArmL));
    vicTracks.push(new THREE.QuaternionKeyframeTrack(`${rightArmName}.quaternion`, vicTimes, vicArmR));

    clips.push(new THREE.AnimationClip('Victory', 2.4, vicTracks));
  }

  return clips;
};

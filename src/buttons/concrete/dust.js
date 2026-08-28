import * as THREE from "three";

export class DustBurst {
  constructor(capacity = 240) {
    this.capacity = capacity;
    this.positions = new Float32Array(capacity * 3).fill(-999);
    this.velocities = new Float32Array(capacity * 3);
    this.life = new Float32Array(capacity);
    this.maxLife = new Float32Array(capacity);
    this.activeCount = 0;
    this.cursor = 0;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.lifeAttribute = new THREE.BufferAttribute(new Float32Array(capacity), 1);
    geometry.setAttribute("aLife", this.lifeAttribute);
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 2, 0), 50);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color("#b3afa3") }, uSize: { value: 0.13 }, uScale: { value: 900 } },
      vertexShader: "attribute float aLife; varying float vLife; uniform float uSize; uniform float uScale; void main() { vLife = aLife; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(uSize * (0.35 + 0.65 * aLife) * uScale / max(-mv.z, 0.5), 160.0); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "varying float vLife; uniform vec3 uColor; void main() { float d = length(gl_PointCoord - 0.5); float alpha = smoothstep(0.5, 0.1, d) * vLife * 0.42; if (alpha < 0.008) discard; gl_FragColor = vec4(uColor, alpha); }",
    });
    this.points = new THREE.Points(geometry, material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
  }

  burst(origin, count, power, directionHint) {
    for (let index = 0; index < count; index += 1) {
      const particle = this.cursor;
      this.cursor = (this.cursor + 1) % this.capacity;
      if (this.life[particle] <= 0) this.activeCount += 1;
      const offset = particle * 3;
      this.positions[offset] = origin.x + (Math.random() - 0.5) * 0.12;
      this.positions[offset + 1] = origin.y + (Math.random() - 0.5) * 0.12;
      this.positions[offset + 2] = origin.z + (Math.random() - 0.5) * 0.12;
      const theta = Math.random() * Math.PI * 2;
      const z = Math.random() * 2 - 1;
      const radius = Math.sqrt(1 - z * z);
      let vx = radius * Math.cos(theta);
      let vy = Math.abs(z) * 0.9 + 0.25;
      let vz = radius * Math.sin(theta);
      if (directionHint) {
        vx += directionHint.x * 0.8;
        vy += directionHint.y * 0.4;
        vz += directionHint.z * 0.8;
      }
      const speed = power * (0.35 + Math.random() * 0.9);
      this.velocities[offset] = vx * speed;
      this.velocities[offset + 1] = vy * speed;
      this.velocities[offset + 2] = vz * speed;
      this.maxLife[particle] = 0.6 + Math.random() * 0.8;
      this.life[particle] = this.maxLife[particle];
      this.lifeAttribute.setX(particle, 1);
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.lifeAttribute.needsUpdate = true;
  }

  setPixelScale(viewportHeightPx, fovDeg) {
    this.points.material.uniforms.uScale.value = viewportHeightPx / (2 * Math.tan(THREE.MathUtils.degToRad(fovDeg) / 2));
  }

  countNear(point, distance) {
    let count = 0;
    for (let index = 0; index < this.capacity; index += 1) {
      if (this.life[index] <= 0) continue;
      const offset = index * 3;
      if ((this.positions[offset] - point.x) ** 2 + (this.positions[offset + 1] - point.y) ** 2 + (this.positions[offset + 2] - point.z) ** 2 < distance ** 2) count += 1;
    }
    return count;
  }

  update(dt) {
    if (!this.activeCount) return false;
    const drag = Math.pow(0.12, dt);
    for (let index = 0; index < this.capacity; index += 1) {
      if (this.life[index] <= 0) continue;
      const offset = index * 3;
      this.life[index] -= dt;
      if (this.life[index] <= 0) {
        this.positions[offset + 1] = -999;
        this.lifeAttribute.setX(index, 0);
        this.activeCount -= 1;
        continue;
      }
      this.velocities[offset] *= drag;
      this.velocities[offset + 1] = this.velocities[offset + 1] * drag - 1.4 * dt;
      this.velocities[offset + 2] *= drag;
      this.positions[offset] += this.velocities[offset] * dt;
      this.positions[offset + 1] += this.velocities[offset + 1] * dt;
      this.positions[offset + 2] += this.velocities[offset + 2] * dt;
      this.lifeAttribute.setX(index, this.life[index] / this.maxLife[index]);
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.lifeAttribute.needsUpdate = true;
    return true;
  }

  dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
    this.activeCount = 0;
  }
}

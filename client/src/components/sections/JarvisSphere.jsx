import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * VibraniumCoreSphere
 * --------------------
 * Black Panther / Wakanda themed 3D holographic AI core.
 * Dark solid shell with dense glowing violet + magenta "vibranium vein"
 * cracks, a 3-layer deep glow halo, drifting mist particles, a real
 * heartbeat-timed pulse (with expanding shockwave rings), mouse-tilt,
 * and click-to-pulse with camera micro-shake.
 *
 * Install dependency first:
 *   npm install three
 *
 * Usage:
 *   <VibraniumCoreSphere status="STABLE" />
 */
export default function VibraniumCoreSphere({
    height = 580,
    violet = "#9d4dff",
    magenta = "#c23fd6",
    deepViolet = "#5a1fb0",
    halo = "#7a2fe0",
    bpm = 72,
    isSpeaking = false,
}) {
    const mountRef = useRef(null);
    const isSpeakingRef = useRef(isSpeaking);

    useEffect(() => {
        isSpeakingRef.current = isSpeaking;
    }, [isSpeaking]);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        let w = container.clientWidth;
        let h = container.clientHeight;

        const VIOLET = new THREE.Color(violet);
        const MAGENTA = new THREE.Color(magenta);
        const DEEPV = new THREE.Color(deepViolet);
        const HALO = new THREE.Color(halo);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
        const camBaseZ = 6.2;
        camera.position.z = camBaseZ;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        // Helper to generate soft radial gradient textures for volumetric light scattering
        function createGlowTexture(colorHex) {
            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext("2d");
            
            const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
            grad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
            grad.addColorStop(0.2, colorHex);
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 128, 128);
            
            const tex = new THREE.CanvasTexture(canvas);
            return tex;
        }

        // Soft volumetric halos using CanvasTexture Sprites (smoothly blends into background)
        const outerGlowTex = createGlowTexture(halo);
        const outerGlowMat = new THREE.SpriteMaterial({
            map: outerGlowTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const outerGlowSprite = new THREE.Sprite(outerGlowMat);
        outerGlowSprite.scale.set(7.5, 7.5, 1.0);
        group.add(outerGlowSprite);

        const innerGlowTex = createGlowTexture(violet);
        const innerGlowMat = new THREE.SpriteMaterial({
            map: innerGlowTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const innerGlowSprite = new THREE.Sprite(innerGlowMat);
        innerGlowSprite.scale.set(5.5, 5.5, 1.0);
        group.add(innerGlowSprite);

        // solid dark shell body
        const baseGeo = new THREE.IcosahedronGeometry(2.0, 3);
        const baseMat = new THREE.MeshBasicMaterial({
            color: 0x08050e,
            transparent: true,
            opacity: 0.94,
        });
        const baseSphere = new THREE.Mesh(baseGeo, baseMat);
        group.add(baseSphere);

        const wireGeo = new THREE.IcosahedronGeometry(2.02, 3);
        const wireMat = new THREE.MeshBasicMaterial({
            color: DEEPV,
            wireframe: true,
            transparent: true,
            opacity: 0.22,
        });
        const wireSphere = new THREE.Mesh(wireGeo, wireMat);
        group.add(wireSphere);

        // dense vibranium veins (two density layers for a cracked look)
        function buildVeins(detail, radius, keepChance) {
            const edgeGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius, detail));
            const arr = edgeGeo.attributes.position.array;
            const segCount = arr.length / 6;
            const keep = [];
            for (let i = 0; i < segCount; i++) {
                if (Math.random() < keepChance) keep.push(i);
            }
            const out = new Float32Array(keep.length * 6);
            keep.forEach((idx, k) => {
                for (let j = 0; j < 6; j++) out[k * 6 + j] = arr[idx * 6 + j];
            });
            edgeGeo.dispose();
            return out;
        }
        const veinGeo = new THREE.BufferGeometry();
        veinGeo.setAttribute("position", new THREE.BufferAttribute(buildVeins(2, 2.03, 0.4), 3));
        const veinMat = new THREE.LineBasicMaterial({
            color: VIOLET,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
        });
        const veins = new THREE.LineSegments(veinGeo, veinMat);
        group.add(veins);

        const veinGeo2 = new THREE.BufferGeometry();
        veinGeo2.setAttribute("position", new THREE.BufferAttribute(buildVeins(3, 2.045, 0.18), 3));
        const veinMat2 = new THREE.LineBasicMaterial({
            color: MAGENTA,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
        });
        const veins2 = new THREE.LineSegments(veinGeo2, veinMat2);
        group.add(veins2);

        // core layers
        const coreMat = new THREE.MeshBasicMaterial({
            color: MAGENTA,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const coreLight = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), coreMat);
        group.add(coreLight);

        const coreGlowMat = new THREE.MeshBasicMaterial({
            color: VIOLET,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const coreGlow = new THREE.Mesh(new THREE.SphereGeometry(0.78, 24, 24), coreGlowMat);
        group.add(coreGlow);

        const coreGlow2Mat = new THREE.MeshBasicMaterial({
            color: HALO,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const coreGlow2 = new THREE.Mesh(new THREE.SphereGeometry(1.15, 20, 20), coreGlow2Mat);
        group.add(coreGlow2);

        // Particles removed to make visualization cleaner

        function makeRing(radius, color, tiltX, tiltY, opacity) {
            const ringGeo = new THREE.TorusGeometry(radius, 0.005, 8, 128);
            const ringMat = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                blending: THREE.AdditiveBlending,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = tiltX;
            ring.rotation.y = tiltY;
            return ring;
        }
        const ring1 = makeRing(2.6, VIOLET, Math.PI / 2.2, 0.3, 0.5);
        const ring2 = makeRing(3.05, MAGENTA, Math.PI / 2.6, -0.6, 0.42);
        const ring3 = makeRing(3.4, HALO, 0.5, 1.1, 0.3);
        group.add(ring1, ring2, ring3);

        // expanding shockwave pulse pool
        const pulsePool = [];
        function spawnPulse(strength) {
            const ringGeo = new THREE.TorusGeometry(0.5, 0.014, 8, 64);
            const mat = new THREE.MeshBasicMaterial({
                color: VIOLET,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
            });
            const ring = new THREE.Mesh(ringGeo, mat);
            ring.rotation.x = Math.PI / 2;
            ring.userData.life = 0;
            ring.userData.strength = strength || 1;
            group.add(ring);
            pulsePool.push(ring);
        }

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        container.addEventListener("mousemove", handleMouseMove);

        let zoomPulse = 0;
        let shake = 0;
        const handleClick = () => {
            spawnPulse(1.6);
            zoomPulse = 1;
            shake = 1;
        };
        container.addEventListener("click", handleClick);

        const clock = new THREE.Clock();
        const beatPeriod = 60 / bpm;
        let beatTimer = 0;
        let frameId;

        function animate() {
            frameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            const dt = clock.getDelta();

            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            group.rotation.y += 0.002;
            group.rotation.x += (mouseY * 0.22 - group.rotation.x) * 0.05;
            group.rotation.y += mouseX * 0.001;

            wireSphere.rotation.y -= 0.001;
            veins.rotation.y = baseSphere.rotation.y;
            veins2.rotation.y = baseSphere.rotation.y - 0.0005;

            const bt = (t % beatPeriod) / beatPeriod;
            const beat = isSpeakingRef.current
                ? (Math.exp(-bt * 10) + 0.6 * Math.exp(-((bt - 0.18) * 10) * ((bt - 0.18) * 10) * 4))
                : 0;
            const scale = 1 + beat * 0.2;
            coreLight.scale.set(scale, scale, scale);
            coreGlow.scale.set(1 + beat * 0.32, 1 + beat * 0.32, 1 + beat * 0.32);
            coreGlow2.scale.set(1 + beat * 0.4, 1 + beat * 0.4, 1 + beat * 0.4);
            veinMat.opacity = 0.55 + beat * 0.45;
            veinMat2.opacity = 0.3 + beat * 0.4;

            // Pulse the soft volumetric glow halos in sync with the heartbeat
            outerGlowSprite.scale.set(7.5 + beat * 0.8, 7.5 + beat * 0.8, 1.0);
            innerGlowSprite.scale.set(5.5 + beat * 0.5, 5.5 + beat * 0.5, 1.0);

            if (isSpeakingRef.current) {
                beatTimer += dt;
                if (beatTimer > beatPeriod) {
                    beatTimer = 0;
                    spawnPulse(1);
                }
            }

            // Particles update removed
    
            ring1.rotation.z += 0.002;
            ring2.rotation.z -= 0.0016;
            ring3.rotation.z += 0.001;

            for (let p = pulsePool.length - 1; p >= 0; p--) {
                const ring = pulsePool[p];
                ring.userData.life += dt;
                const lp = ring.userData.life / 1.5;
                const s = (0.5 + lp * 4.5) * ring.userData.strength;
                ring.scale.set(s, s, s);
                ring.material.opacity = Math.max(0, 0.85 * (1 - lp));
                if (lp >= 1) {
                    group.remove(ring);
                    ring.geometry.dispose();
                    ring.material.dispose();
                    pulsePool.splice(p, 1);
                }
            }

            if (zoomPulse > 0) {
                zoomPulse -= dt * 1.5;
                if (zoomPulse < 0) zoomPulse = 0;
            }
            if (shake > 0) {
                shake -= dt * 3;
                if (shake < 0) shake = 0;
            }
            camera.position.z = camBaseZ - zoomPulse * 0.35;
            camera.position.x = (Math.random() - 0.5) * 0.04 * shake;
            camera.position.y = (Math.random() - 0.5) * 0.04 * shake;

            renderer.render(scene, camera);
        }
        animate();

        const handleResize = () => {
            w = container.clientWidth;
            h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("click", handleClick);
            container.removeChild(renderer.domElement);

            pulsePool.forEach((ring) => {
                ring.geometry.dispose();
                ring.material.dispose();
            });

            outerGlowTex.dispose();
            outerGlowMat.dispose();
            innerGlowTex.dispose();
            innerGlowMat.dispose();
            baseGeo.dispose();
            baseMat.dispose();
            wireGeo.dispose();
            wireMat.dispose();
            veinGeo.dispose();
            veinMat.dispose();
            veinGeo2.dispose();
            veinMat2.dispose();
            coreLight.geometry.dispose();
            coreMat.dispose();
            coreGlow.geometry.dispose();
            coreGlowMat.dispose();
            coreGlow2.geometry.dispose();
            coreGlow2Mat.dispose();
            // Particles dispose removed
            [ring1, ring2, ring3].forEach((r) => {
                r.geometry.dispose();
                r.material.dispose();
            });
            renderer.dispose();
        };
    }, [violet, magenta, deepViolet, halo, bpm]);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height,
                background: "transparent",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
            }}
        >
            <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}
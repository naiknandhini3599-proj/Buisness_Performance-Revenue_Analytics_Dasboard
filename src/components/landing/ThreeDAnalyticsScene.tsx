import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowUpRight, TrendingUp, DollarSign, Activity, ShieldCheck, Zap } from 'lucide-react';

export const ThreeDAnalyticsScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check user reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x071426, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x2563eb, 3, 20);
    blueLight.position.set(5, 5, 4);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 4, 15);
    cyanLight.position.set(-4, 2, 2);
    scene.add(cyanLight);

    // 3. Grid Plane (Layered analytics grid)
    const gridHelper = new THREE.GridHelper(16, 24, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // 4. 3D Revenue Bar Columns (Holographic glass pillars)
    const barsGroup = new THREE.Group();
    const barCount = 7;
    const bars: THREE.Mesh[] = [];
    const heights = [2.2, 3.4, 1.8, 4.2, 3.1, 4.8, 5.2];

    for (let i = 0; i < barCount; i++) {
      const geometry = new THREE.BoxGeometry(0.5, heights[i], 0.5);
      const material = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0x2563eb : 0x06b6d4,
        emissive: i % 2 === 0 ? 0x1d4ed8 : 0x0891b2,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        transmission: 0.3,
      });

      const bar = new THREE.Mesh(geometry, material);
      bar.position.set((i - barCount / 2) * 0.9, heights[i] / 2 - 1.2, (Math.sin(i) * 0.8) - 1);
      barsGroup.add(bar);
      bars.push(bar);
    }
    scene.add(barsGroup);

    // 5. Glowing Particle Nodes (Cloud of data points)
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 6 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const isCyan = Math.random() > 0.5;
      colors[i * 3] = isCyan ? 0.13 : 0.23;
      colors[i * 3 + 1] = isCyan ? 0.82 : 0.51;
      colors[i * 3 + 2] = isCyan ? 0.93 : 0.96;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Mouse Interaction Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    container.addEventListener('mousemove', onMouseMove);

    // 7. Animation Loop
    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const elapsedTime = timer.getElapsed();

      if (!prefersReducedMotion) {
        // Smooth camera lerp
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX * 1.5;
        camera.position.y = 3 + targetY * 0.8;
        camera.lookAt(0, 1.2, 0);

        // Animate particles
        particles.rotation.y = elapsedTime * 0.05;

        // Subtle bar height oscillation
        bars.forEach((bar, idx) => {
          const scale = 1 + Math.sin(elapsedTime * 1.5 + idx) * 0.08;
          bar.scale.y = scale;
        });

        // Rotate group subtly
        barsGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      timer.dispose();
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative h-[480px] w-full lg:h-[580px]">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Floating Glassmorphic UI Panels anchored in perspective */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
        {/* Top-Right Floating Metric Badge */}
        <div className="self-end animate-bounce-slow rounded-xl border border-white/15 bg-white/10 p-3.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <Activity className="h-3.5 w-3.5" />
            <span>Live Performance Metric</span>
          </div>
          <div className="mt-1 text-2xl font-black text-white">₹1,82,627</div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+61.7% recognized deal value</span>
          </div>
        </div>

        {/* Center-Left Floating KPI Card */}
        <div className="max-w-[240px] animate-pulse-slow self-start rounded-xl border border-white/15 bg-white/10 p-3.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Conversion Efficiency</span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
              Optimal
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">25.3%</span>
            <span className="text-xs text-slate-300">Quote-to-Deal</span>
          </div>
          {/* Mini progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          </div>
        </div>

        {/* Bottom Floating Card */}
        <div className="self-end animate-bounce-slow rounded-xl border border-white/15 bg-slate-900/80 p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Enterprise Reconciliation</div>
              <div className="text-[10px] text-slate-400">Zero double-counting • Mathematical precision</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

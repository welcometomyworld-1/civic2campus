import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { JHARKHAND_DISTRICTS, UNIVERSITIES, INDUSTRY_PARTNERS } from '../data/mockData';
import { DistrictInfo } from '../types';
import { Layers, Maximize2, RotateCcw, Sparkles, Filter, Activity, Building, Users, AlertTriangle } from 'lucide-react';

interface Jharkhand3DMapProps {
  onSelectDistrict?: (district: DistrictInfo) => void;
  selectedDistrictId?: string;
  className?: string;
  isHeroMode?: boolean;
}

export const Jharkhand3DMap: React.FC<Jharkhand3DMapProps> = ({
  onSelectDistrict,
  selectedDistrictId,
  className = '',
  isHeroMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<DistrictInfo | null>(
    JHARKHAND_DISTRICTS.find((d) => d.id === selectedDistrictId) || null
  );
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [is3DMode, setIs3DMode] = useState(true);
  const [showControls, setShowControls] = useState(!isHeroMode);
  
  // Layer toggles
  const [layers, setLayers] = useState({
    problems: true,
    universities: true,
    industries: true,
    projects: true,
    impactGlow: true,
  });

  // Filter
  const [domainFilter, setDomainFilter] = useState('ALL');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const districtMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const connectionsGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 8, 12));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (selectedDistrictId) {
      const match = JHARKHAND_DISTRICTS.find((d) => d.id === selectedDistrictId);
      if (match) {
        setActiveDistrict(match);
        targetCameraPos.current.set(match.x * 0.9, 4.5, match.z * 0.9 + 5.5);
        targetLookAt.current.set(match.x, 0.4, match.z);
      }
    }
  }, [selectedDistrictId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xfcfbf9); // Light-first luxury theme
    scene.fog = new THREE.FogExp2(0xfcfbf9, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 8.5, 12.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(10, 20, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    rimLight.position.set(-15, 8, -10);
    scene.add(rimLight);

    const warmAccent = new THREE.PointLight(0x10b981, 1.5, 25);
    warmAccent.position.set(0, 3, 0);
    scene.add(warmAccent);

    // 5. Ground grid plane
    const gridHelper = new THREE.GridHelper(26, 26, 0x0284c7, 0xe2e8f0);
    gridHelper.position.y = -0.05;
    (gridHelper.material as THREE.Material).opacity = 0.45;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    // Base boundary plate
    const baseGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.3, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
    });
    const basePlate = new THREE.Mesh(baseGeo, baseMat);
    basePlate.position.y = -0.2;
    basePlate.receiveShadow = true;
    scene.add(basePlate);

    // Border glowing ring
    const ringGeo = new THREE.RingGeometry(8.55, 8.7, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.04;
    scene.add(ringMesh);

    // 6. District Extruded Meshes
    const districtMeshes = new Map<string, THREE.Mesh>();
    JHARKHAND_DISTRICTS.forEach((dist) => {
      // Extrusion height proportional to problem density
      const height = is3DMode ? 0.3 + (dist.totalProblems / 450) * 1.6 : 0.15;
      
      const shape = new THREE.Shape();
      if (dist.polygonPoints && dist.polygonPoints.length > 2) {
        shape.moveTo(dist.polygonPoints[0][0] * 1.8, dist.polygonPoints[0][1] * 1.8);
        for (let i = 1; i < dist.polygonPoints.length; i++) {
          shape.lineTo(dist.polygonPoints[i][0] * 1.8, dist.polygonPoints[i][1] * 1.8);
        }
      } else {
        // Hexagonal fallback
        const r = 0.9;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (i === 0) shape.moveTo(px, py);
          else shape.lineTo(px, py);
        }
      }
      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.08,
        bevelSegments: 3,
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.rotateX(Math.PI / 2); // Lay flat on XZ plane

      // Color scheme based on density
      const isSelected = activeDistrict?.id === dist.id;
      const baseColor = isSelected ? 0x0284c7 : dist.criticalProblems > 30 ? 0xf43f5e : 0x0ea5e9;

      const mat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.25,
        metalness: 0.2,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.82,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(dist.x, 0, dist.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { district: dist, originalY: 0, height };

      // Add district outline edge
      const edges = new THREE.EdgesGeometry(geo, 20);
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0x38bdf8 : 0xffffff,
        linewidth: 2,
        transparent: true,
        opacity: 0.75,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      mesh.add(wireframe);

      scene.add(mesh);
      districtMeshes.set(dist.id, mesh);
    });
    districtMeshesRef.current = districtMeshes;

    // 7. Dynamic Markers Group
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // 8. Glowing Connecting Curves Group
    const connectionsGroup = new THREE.Group();
    scene.add(connectionsGroup);
    connectionsGroupRef.current = connectionsGroup;

    // Create interconnected curves between active districts & capital (Ranchi)
    const ranchi = JHARKHAND_DISTRICTS.find((d) => d.id === 'ranchi') || JHARKHAND_DISTRICTS[1];
    JHARKHAND_DISTRICTS.forEach((d) => {
      if (d.id === 'ranchi') return;
      
      const start = new THREE.Vector3(d.x, 0.8 + (d.totalProblems / 450) * 1.5, d.z);
      const end = new THREE.Vector3(ranchi.x, 1.4, ranchi.z);
      const mid = new THREE.Vector3((start.x + end.x) / 2, Math.max(start.y, end.y) + 1.2, (start.z + end.z) / 2);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(30);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: d.criticalProblems > 30 ? 0xf43f5e : 0x0ea5e9,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(curveGeo, curveMat);
      connectionsGroup.add(line);
    });

    // 9. Particle Atmosphere
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 5 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      colors[i * 3] = 0.05; // R
      colors[i * 3 + 1] = 0.65; // G
      colors[i * 3 + 2] = 0.95; // B
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 10. Mouse interaction & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = 0;
    let cameraRadius = 14;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        cameraAngle += deltaX * 0.005;
        targetCameraPos.current.x = Math.sin(cameraAngle) * cameraRadius;
        targetCameraPos.current.z = Math.cos(cameraAngle) * cameraRadius;
      }

      previousMousePosition = { x: event.clientX, y: event.clientY };

      // Raycast for hover
      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(districtMeshes.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const dist = hit.userData.district as DistrictInfo;
        setHoveredDistrict(dist);
        setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        container.style.cursor = 'pointer';
      } else {
        setHoveredDistrict(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(districtMeshes.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const dist = hit.userData.district as DistrictInfo;
        setActiveDistrict(dist);
        if (onSelectDistrict) onSelectDistrict(dist);

        // Smooth camera transition to target district
        targetCameraPos.current.set(dist.x * 0.9, 4.5, dist.z * 0.9 + 5.5);
        targetLookAt.current.set(dist.x, 0.4, dist.z);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);

    // Resize Handler with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow gentle auto-orbit when not dragging and in hero mode
      if (isHeroMode && !isDragging) {
        cameraAngle += 0.0012;
        targetCameraPos.current.x = Math.sin(cameraAngle) * 14.5;
        targetCameraPos.current.z = Math.cos(cameraAngle) * 14.5;
      }

      // Smooth camera interpolation (Lerp)
      camera.position.lerp(targetCameraPos.current, 0.04);
      camera.lookAt(targetLookAt.current);

      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.05;
      }

      // Animate connections pulse
      if (connectionsGroupRef.current) {
        connectionsGroupRef.current.children.forEach((line, idx) => {
          const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
          mat.opacity = 0.25 + Math.sin(elapsedTime * 2 + idx) * 0.15;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [is3DMode, isHeroMode]);

  // Reset Camera View
  const handleResetCamera = () => {
    targetCameraPos.current.set(0, 8.5, 12.5);
    targetLookAt.current.set(0, 0, 0);
    setActiveDistrict(null);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-stone-50/50 rounded-2xl border border-stone-200/80 shadow-inner ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Glass Tooltip on District Hover */}
      {hoveredDistrict && (
        <div
          className="absolute z-30 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y + 14}px`,
            transform: 'translate(0, 0)',
          }}
        >
          <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-stone-200/90 text-stone-900 min-w-[210px]">
            <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1.5 mb-2">
              <span className="font-semibold text-base tracking-tight text-stone-900">
                {hoveredDistrict.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {hoveredDistrict.activeProjects} Projects
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-stone-600 font-medium">
              <div className="flex justify-between">
                <span>Total Reported:</span>
                <span className="font-bold text-stone-900">{hoveredDistrict.totalProblems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  Critical:
                </span>
                <span className="font-bold text-rose-600">{hoveredDistrict.criticalProblems}</span>
              </div>
              <div className="flex justify-between">
                <span>Citizens Impacted:</span>
                <span className="font-bold text-emerald-600">
                  {hoveredDistrict.citizensImpacted.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-stone-100 text-[10px] text-stone-400 italic">
              Click to inspect district intelligence
            </div>
          </div>
        </div>
      )}

      {/* Map Floating Control Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-stone-200/80 flex items-center gap-3 text-xs text-stone-700 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-stone-900">Jharkhand 3D Innovation Grid</span>
          </div>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500">15 Districts Synced</span>
        </div>
      </div>

      {/* Right Controls Panel */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2.5">
          {/* 3D / 2D Toggle */}
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-sm border border-stone-200/80 flex gap-1 text-xs">
            <button
              onClick={() => setIs3DMode(true)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                is3DMode
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              3D Extrusion
            </button>
            <button
              onClick={() => setIs3DMode(false)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                !is3DMode
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              2D Planar
            </button>
          </div>

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 p-2 rounded-xl shadow-sm border border-stone-200/80 transition-all flex items-center justify-center gap-1.5 text-xs font-medium"
            title="Reset Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset View</span>
          </button>
        </div>
      )}

      {/* Legend at Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-sm border border-stone-200/80 flex flex-wrap items-center gap-3.5 text-[11px] font-medium text-stone-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>🔴 Critical Problems</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span>🔵 Universities</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>🟣 Industry Partners</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>🟢 Deployed Impact</span>
        </div>
      </div>
    </div>
  );
};

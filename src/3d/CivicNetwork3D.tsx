import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Network, Cpu, GraduationCap, Building2, Landmark, CheckCircle2, HeartHandshake } from 'lucide-react';

interface CivicNetworkNode {
  id: string;
  name: string;
  subTitle: string;
  role: string;
  position: [number, number, number];
  color: number;
  stats: { label: string; value: string }[];
  connections: string[];
}

const NETWORK_NODES: CivicNetworkNode[] = [
  {
    id: 'citizens',
    name: 'CITIZENS',
    subTitle: 'Community Problem Reports',
    role: 'Grassroots Origin',
    position: [-4.2, 1.8, -1.2],
    color: 0xf59e0b, // Amber
    stats: [
      { label: 'Active Reports', value: '24,821' },
      { label: 'Verified Communities', value: '1,420' },
      { label: 'Villages Reached', value: '864' },
      { label: 'Avg Resolution Rate', value: '82%' },
    ],
    connections: ['ai_engine'],
  },
  {
    id: 'ai_engine',
    name: 'AI ENGINE',
    subTitle: 'Intelligence & Prioritization',
    role: 'Central Processing Unit',
    position: [0, 2.8, 0],
    color: 0x0284c7, // Sky Blue
    stats: [
      { label: 'Semantic Accuracy', value: '94.2%' },
      { label: 'Clusters Formed', value: '412' },
      { label: 'Matching Latency', value: '<1.4s' },
      { label: 'Proposals Generated', value: '318' },
    ],
    connections: ['universities', 'industry', 'government', 'solutions'],
  },
  {
    id: 'universities',
    name: 'UNIVERSITIES',
    subTitle: 'Higher Education R&D',
    role: 'Research & Labs',
    position: [3.8, 2.2, -1.5],
    color: 0x6366f1, // Indigo
    stats: [
      { label: 'Universities', value: '42' },
      { label: 'Departments', value: '186' },
      { label: 'Faculty Mentors', value: '1,248' },
      { label: 'Active R&D Labs', value: '94' },
    ],
    connections: ['students', 'solutions'],
  },
  {
    id: 'students',
    name: 'STUDENTS & TEAMS',
    subTitle: 'Multidisciplinary Innovators',
    role: 'Prototyping Force',
    position: [4.4, -1.6, 0.8],
    color: 0x8b5cf6, // Violet
    stats: [
      { label: 'Enrolled Innovators', value: '3,820' },
      { label: 'Cross-Domain Teams', value: '412' },
      { label: 'Prototypes Built', value: '286' },
      { label: 'Patents Pending', value: '18' },
    ],
    connections: ['industry', 'solutions'],
  },
  {
    id: 'industry',
    name: 'INDUSTRY & STARTUPS',
    subTitle: 'CSR Funding & Scale Mentorship',
    role: 'Commercialization Catalysts',
    position: [1.8, -2.4, 2.2],
    color: 0xec4899, // Pink
    stats: [
      { label: 'Corporate Partners', value: '42' },
      { label: 'CSR Grants Committed', value: '₹18.4 Cr' },
      { label: 'Incubated Startups', value: '26' },
      { label: 'Hardware Kits Donated', value: '4,500' },
    ],
    connections: ['solutions', 'impact'],
  },
  {
    id: 'government',
    name: 'GOVERNMENT',
    subTitle: 'Policy, Permitting & Deployment',
    role: 'Administrative Enabler',
    position: [-3.4, -1.8, 1.8],
    color: 0x059669, // Emerald
    stats: [
      { label: 'Administrative Blocks', value: '260' },
      { label: 'District Collectors Synced', value: '24' },
      { label: 'State Sanction Orders', value: '184' },
      { label: 'Field Verification Teams', value: '72' },
    ],
    connections: ['solutions', 'impact'],
  },
  {
    id: 'solutions',
    name: 'SOLUTIONS',
    subTitle: 'Hardware, IoT & Field Pilots',
    role: 'Deployment Ready Assets',
    position: [0, -0.4, 0.4],
    color: 0x10b981, // Emerald Green
    stats: [
      { label: 'Live Prototypes', value: '412' },
      { label: 'Field Pilots Active', value: '148' },
      { label: 'Permanent Deployments', value: '94' },
      { label: 'Uptime Reliability', value: '99.4%' },
    ],
    connections: ['impact'],
  },
  {
    id: 'impact',
    name: 'MEASURABLE IMPACT',
    subTitle: 'Transforming Lives in Jharkhand',
    role: 'Final Mission Outcome',
    position: [0, -3.2, -1.2],
    color: 0x14b8a6, // Teal
    stats: [
      { label: 'Citizens Impacted', value: '1,842,000+' },
      { label: 'Water Hours Saved', value: '4.8M hrs' },
      { label: 'Crop Yield Uplift', value: '+34%' },
      { label: 'PHC Transit Time Cut', value: '-65%' },
    ],
    connections: ['citizens'],
  },
];

export const CivicNetwork3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<CivicNetworkNode | null>(NETWORK_NODES[1]); // Default AI Engine selected
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbfaf8);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0x0284c7, 2, 20);
    pointLight.position.set(0, 3, 4);
    scene.add(pointLight);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Create Node Spheres & Rings
    const nodeMeshes: THREE.Mesh[] = [];
    NETWORK_NODES.forEach((n) => {
      const isCentral = n.id === 'ai_engine' || n.id === 'solutions';
      const size = isCentral ? 0.75 : 0.55;

      const sphereGeo = new THREE.SphereGeometry(size, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: n.color,
        roughness: 0.2,
        metalness: 0.3,
        emissive: n.color,
        emissiveIntensity: 0.2,
      });

      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(...n.position);
      sphere.userData = { node: n };

      // Outer ring
      const ringGeo = new THREE.RingGeometry(size * 1.3, size * 1.45, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: n.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 4;
      sphere.add(ring);

      group.add(sphere);
      nodeMeshes.push(sphere);
    });

    // 2. Create Curved Bezier Cables
    const curvePointsList: THREE.Vector3[][] = [];
    NETWORK_NODES.forEach((sourceNode) => {
      sourceNode.connections.forEach((targetId) => {
        const targetNode = NETWORK_NODES.find((x) => x.id === targetId);
        if (!targetNode) return;

        const p1 = new THREE.Vector3(...sourceNode.position);
        const p2 = new THREE.Vector3(...targetNode.position);
        const mid = new THREE.Vector3(
          (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 0.8,
          (p1.y + p2.y) / 2 + 0.8,
          (p1.z + p2.z) / 2
        );

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(40);
        curvePointsList.push(points);

        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: sourceNode.color,
          transparent: true,
          opacity: 0.35,
          linewidth: 1.5,
        });

        const line = new THREE.Line(lineGeo, lineMat);
        group.add(line);
      });
    });

    // 3. Pulse Particles traveling along cables
    const pulseCount = 35;
    const pulseGeo = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseProgress = new Float32Array(pulseCount);
    const pulseCurves = new Int32Array(pulseCount);

    for (let i = 0; i < pulseCount; i++) {
      pulseProgress[i] = Math.random();
      pulseCurves[i] = Math.floor(Math.random() * curvePointsList.length);
    }

    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.18,
      transparent: true,
      opacity: 0.9,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    group.add(pulsePoints);

    // Interaction Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);

      if (hits.length > 0) {
        const hitNode = hits[0].object.userData.node as CivicNetworkNode;
        setHoveredNode(hitNode);
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow gentle scene rotation
      group.rotation.y = Math.sin(t * 0.25) * 0.2;
      group.rotation.x = Math.cos(t * 0.2) * 0.08;

      // Move pulse particles
      const posAttr = pulseGeo.getAttribute('position') as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < pulseCount; i++) {
        pulseProgress[i] += 0.008;
        if (pulseProgress[i] > 1) {
          pulseProgress[i] = 0;
          pulseCurves[i] = Math.floor(Math.random() * curvePointsList.length);
        }

        const curvePts = curvePointsList[pulseCurves[i]];
        if (curvePts && curvePts.length > 0) {
          const ptIdx = Math.floor(pulseProgress[i] * (curvePts.length - 1));
          const pt = curvePts[ptIdx];
          posArr[i * 3] = pt.x;
          posArr[i * 3 + 1] = pt.y;
          posArr[i * 3 + 2] = pt.z;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 border border-stone-200/80 shadow-inner ${className}`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Top Banner Tag */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-stone-200/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
          <Network className="w-4 h-4 text-sky-600" />
          <span>3D Civic Innovation Ecosystem Network</span>
        </div>
        <div className="text-[11px] text-stone-500 font-medium mt-0.5">
          Real-time interconnected actors in Jharkhand
        </div>
      </div>

      {/* Persistent Selected Node Stats Card at Bottom Right */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 z-20 w-80 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/90 text-stone-900 transition-all duration-150 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2 mb-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                {hoveredNode.role}
              </div>
              <h4 className="text-base font-bold text-stone-900 tracking-tight">
                {hoveredNode.name}
              </h4>
            </div>
            <div
              className="w-3.5 h-3.5 rounded-full ring-4 ring-stone-100"
              style={{ backgroundColor: `#${hoveredNode.color.toString(16).padStart(6, '0')}` }}
            />
          </div>

          <div className="text-xs text-stone-600 font-medium mb-3">
            {hoveredNode.subTitle}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {hoveredNode.stats.map((stat, idx) => (
              <div key={idx} className="bg-stone-50/80 rounded-xl p-2 border border-stone-100">
                <div className="text-[10px] text-stone-500 font-medium">{stat.label}</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Hover any node to inspect metrics</span>
            <span className="text-sky-600 font-semibold">Live Synced</span>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap, Orbit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TimelineItem {
  id: number;
  title: string;
  category: string;
  date?: string;
  status?: string;
  energy: number;
  content: string;
  icon: any;
  relatedIds: number[];
}

export default function RadialOrbitalTimeline({ timelineData }: { timelineData: TimelineItem[] }) {
  const [activeNodeId, setActiveNodeId] = useState<number>(timelineData[0].id);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const radius = 220; // Base radius for the orbit
  const angleStep = 360 / timelineData.length;

  // Handle auto-rotation
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (autoRotate) {
        const deltaTime = time - lastTime;
        // Rotate 12.85 degrees per second (takes ~28s for a full rotation)
        // This makes a card stay in the "active" hemisphere for exactly 7 seconds
        // (7 seconds * 12.85 deg/sec = ~90 degrees of travel)
        setRotationAngle((prev) => (prev + (12.85 * deltaTime) / 1000) % 360);
      }
      lastTime = time;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [autoRotate]);

  // Auto-activate node when it enters the 3 o'clock (right) hemisphere
  useEffect(() => {
    if (!autoRotate) return;

    let closestId = timelineData[0].id;
    let minDistance = 360;

    timelineData.forEach((item, index) => {
      const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
      // Distance to 0 degrees (3 o'clock)
      const dist = Math.min(angle, 360 - angle);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = item.id;
      }
    });

    if (activeNodeId !== closestId) {
      setActiveNodeId(closestId);
    }
  }, [rotationAngle, timelineData, autoRotate, activeNodeId]);

  const handleContainerClick = () => {
    setAutoRotate(false);
  };

  const toggleItem = (id: number) => {
    setActiveNodeId(id);
    const itemIndex = timelineData.findIndex((i) => i.id === id);
    if (itemIndex !== -1) {
      const targetAngle = -itemIndex * angleStep;
      setRotationAngle(targetAngle);
    }
    
    // Scroll to card on mobile
    if (window.innerWidth < 1024 && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.3,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((t) => t.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const activeItem = timelineData.find((t) => t.id === activeNodeId) || timelineData[0];

  return (
    <div
      className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 py-4"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* MOBILE HEADER (Visible only on mobile) */}
      <div className="lg:hidden w-full text-center px-4 pt-4 mb-4">
        <span className="inline-flex items-center justify-center px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-full border border-primary-200 dark:border-primary-800">
          Nuestro Propósito
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          Lo que nos impulsa
        </h2>
        <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
          Descubre los pilares que conforman la identidad y el futuro de Corporación Maresa. 
          Explora nuestra órbita de valores interactuando con cada nodo.
        </p>
      </div>

      {/* LEFT COLUMN: Orbital Timeline */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center h-[350px] lg:h-[600px] mb-8 lg:mb-0">
        <div
          className="absolute flex items-center justify-center w-full h-full scale-75 sm:scale-90 lg:scale-100"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Decorative Outer Rings */}
          <div
            className="absolute rounded-full border border-slate-300/60 dark:border-white/5 border-dashed"
            style={{ width: radius * 2.5, height: radius * 2.5 }}
          />
          <div
            className="absolute rounded-full border border-slate-300/80 dark:border-white/10"
            style={{ width: radius * 2, height: radius * 2 }}
          />

          {/* Core Star / Brand Center */}
          <div
            className="absolute w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary-500 via-blue-600 to-indigo-600 animate-pulse flex items-center justify-center z-10 shadow-[0_0_60px_rgba(37,99,235,0.4)]"
          >
            <div className="absolute w-[120%] h-[120%] rounded-full border border-primary-400/40 animate-ping opacity-70"></div>
            <div className="absolute w-[140%] h-[140%] rounded-full border border-primary-500/20 animate-ping opacity-50" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/95 backdrop-blur-md shadow-inner flex items-center justify-center">
              <Orbit className="w-6 h-6 lg:w-8 lg:h-8 text-primary-600" />
            </div>
          </div>

          {/* Orbital Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isActive = activeNodeId === item.id;
            const isRelated = isRelatedToActive(item.id);
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px) scale(${isActive ? 1.2 : 1})`,
              zIndex: isActive ? 200 : position.zIndex,
              opacity: isActive ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                className="absolute transition-all duration-300 cursor-pointer group"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Node Glow */}
                <div
                  className={`absolute rounded-full -inset-4 ${isActive ? "animate-pulse duration-1000 opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}`}
                  style={{
                    background: `radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 70%)`,
                    width: `${item.energy * 0.8 + 60}px`,
                    height: `${item.energy * 0.8 + 60}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>

                {/* Node Container */}
                <div
                  className={`
                  relative w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center
                  ${isActive ? "bg-primary-600 text-white" : isRelated ? "bg-slate-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"}
                  border-2 
                  ${isActive ? "border-primary-400 shadow-[0_0_30px_rgba(59,130,246,0.6)]" : isRelated ? "border-primary-400 animate-pulse" : "border-slate-200 dark:border-slate-700 shadow-sm"}
                  transition-all duration-300
                `}
                >
                  <Icon size={isActive ? 32 : 24} strokeWidth={isActive ? 2 : 1.5} className="transition-all duration-300" />
                </div>

                {/* Node Label */}
                <div
                  className={`
                  absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-sm font-bold tracking-widest uppercase
                  transition-all duration-300
                  ${isActive ? "text-primary-700 dark:text-primary-400 drop-shadow-md scale-110" : "text-slate-600 dark:text-slate-400 opacity-80 group-hover:opacity-100"}
                `}
                >
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Information Panel & Header */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start min-h-[400px]">

        {/* Section Header injected here (Desktop only) */}
        <div className="hidden lg:block mb-8 lg:pr-8 text-left">
          <span className="inline-flex items-center justify-center px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-full border border-primary-200 dark:border-primary-800">
            Nuestro Propósito
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Lo que nos impulsa
          </h2>
          <p className="text-slate-700 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Descubre los pilares que conforman la identidad y el futuro de Corporación Maresa. 
            Explora nuestra órbita de valores interactuando con cada nodo.
          </p>
        </div>

        <div ref={cardRef} key={activeItem.id} className="w-full max-w-xl h-[420px] lg:h-[380px] flex flex-col animate-fade-in-up bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          {/* Decorative BG element in panel */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center border border-primary-100 dark:border-primary-800/50 flex-shrink-0">
                <activeItem.icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase border-primary-200 bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400 mb-1">
                  {activeItem.category}
                </Badge>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeItem.title}
                </h3>
              </div>
            </div>

            <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 flex-1">
              {activeItem.content}
            </p>

            <div className="space-y-4 mt-auto">
              {/* Energy Indicator */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="flex items-center font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <Zap size={14} className="mr-2 text-amber-500" />
                    Impacto Vital
                  </span>
                  <span className="font-mono font-bold text-sm text-primary-700 dark:text-primary-400">{activeItem.energy}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-primary-500 to-indigo-600 rounded-full relative transition-all duration-1000"
                    style={{ width: `${activeItem.energy}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Connected Nodes */}
              {activeItem.relatedIds.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <Link size={12} className="text-slate-500 dark:text-slate-400 mr-2" />
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-400">
                      Pilares Conectados
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeItem.relatedIds.map((relatedId) => {
                      const relatedItem = timelineData.find(i => i.id === relatedId);
                      return (
                        <Button
                          key={relatedId}
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(relatedId);
                          }}
                          className="h-8 px-3 text-[10px] font-bold tracking-wider uppercase rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-primary-50 hover:border-primary-200 dark:hover:bg-primary-900/40 dark:hover:border-primary-800 hover:text-primary-700 dark:hover:text-primary-400 transition-all group shadow-sm text-slate-700 dark:text-slate-300"
                        >
                          {relatedItem?.title}
                          <ArrowRight size={12} className="ml-1.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

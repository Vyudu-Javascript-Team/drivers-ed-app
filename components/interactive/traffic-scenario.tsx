'use client';

import { Stage, Layer, Circle, Rect, Arrow } from 'react-konva';
import { useState, useEffect } from 'react';
import useSound from 'use-sound';

interface Vehicle {
  id: string;
  x: number;
  y: number;
  rotation: number;
  type: 'car' | 'truck';
  color: string;
}

interface TrafficScenarioProps {
  width: number;
  height: number;
  vehicles: Vehicle[];
  onComplete?: () => void;
}

export function TrafficScenario({ width, height, vehicles: initialVehicles, onComplete }: TrafficScenarioProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [playHonk] = useSound('/sounds/honk.mp3');
  const [playCollision] = useSound('/sounds/collision.mp3');

  useEffect(() => {
    const animation = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        x: vehicle.x + Math.cos(vehicle.rotation * Math.PI / 180) * 2,
        y: vehicle.y + Math.sin(vehicle.rotation * Math.PI / 180) * 2,
      })));
    }, 50);

    return () => clearInterval(animation);
  }, []);

  const handleVehicleClick = (id: string) => {
    setSelectedVehicle(id);
    playHonk();
  };

  const checkCollisions = () => {
    for (let i = 0; i < vehicles.length; i++) {
      for (let j = i + 1; j < vehicles.length; j++) {
        const dx = vehicles[i].x - vehicles[j].x;
        const dy = vehicles[i].y - vehicles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 30) {
          playCollision();
          onComplete?.();
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    checkCollisions();
  }, [vehicles]);

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Road */}
        <Rect
          x={0}
          y={height / 2 - 25}
          width={width}
          height={50}
          fill="#444"
        />
        
        {/* Vehicles */}
        {vehicles.map(vehicle => (
          <Circle
            key={vehicle.id}
            x={vehicle.x}
            y={vehicle.y}
            radius={vehicle.type === 'car' ? 15 : 20}
            fill={vehicle.color}
            rotation={vehicle.rotation}
            onClick={() => handleVehicleClick(vehicle.id)}
            onTap={() => handleVehicleClick(vehicle.id)}
            shadowColor="black"
            shadowBlur={selectedVehicle === vehicle.id ? 10 : 0}
            shadowOpacity={0.3}
          />
        ))}

        {/* Direction indicators */}
        {vehicles.map(vehicle => (
          <Arrow
            key={`arrow-${vehicle.id}`}
            points={[
              vehicle.x,
              vehicle.y,
              vehicle.x + Math.cos(vehicle.rotation * Math.PI / 180) * 30,
              vehicle.y + Math.sin(vehicle.rotation * Math.PI / 180) * 30,
            ]}
            stroke={vehicle.color}
            strokeWidth={2}
            fill={vehicle.color}
          />
        ))}
      </Layer>
    </Stage>
  );
}
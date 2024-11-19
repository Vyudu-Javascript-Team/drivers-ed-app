'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Vehicle {
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  type: 'car' | 'truck' | 'bus';
}

interface TrafficScenarioProps {
  scenario: {
    vehicles: Vehicle[];
    trafficLights: any[];
    pedestrians: any[];
    weatherConditions: string;
    timeOfDay: string;
  };
  onComplete: (success: boolean) => void;
}

export function TrafficSimulator({ scenario, onComplete }: TrafficScenarioProps) {
  const [vehicles, setVehicles] = useState(scenario.vehicles);
  const [isPlaying, setIsPlaying] = useState(false);
  const [collisions, setCollisions] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        updateVehicles();
        checkCollisions();
      }, 16); // 60fps

      return () => clearInterval(interval);
    }
  }, [isPlaying, vehicles]);

  const updateVehicles = () => {
    setVehicles(prev => prev.map(vehicle => ({
      ...vehicle,
      position: calculateNewPosition(vehicle),
      rotation: calculateNewRotation(vehicle),
    })));
  };

  const checkCollisions = () => {
    // Collision detection logic
    let newCollisions = 0;
    for (let i = 0; i < vehicles.length; i++) {
      for (let j = i + 1; j < vehicles.length; j++) {
        if (detectCollision(vehicles[i], vehicles[j])) {
          newCollisions++;
        }
      }
    }

    if (newCollisions > collisions) {
      toast.error('Collision detected!');
      setCollisions(newCollisions);
      if (newCollisions >= 3) {
        setIsPlaying(false);
        onComplete(false);
      }
    }
  };

  const calculateNewPosition = (vehicle: Vehicle): [number, number, number] => {
    const [x, y, z] = vehicle.position;
    const speed = vehicle.speed;
    const [rotX, rotY, rotZ] = vehicle.rotation;
    
    return [
      x + Math.sin(rotY) * speed,
      y,
      z + Math.cos(rotY) * speed,
    ];
  };

  const calculateNewRotation = (vehicle: Vehicle): [number, number, number] => {
    // Add steering logic here
    return vehicle.rotation;
  };

  const detectCollision = (v1: Vehicle, v2: Vehicle): boolean => {
    const [x1, y1, z1] = v1.position;
    const [x2, y2, z2] = v2.position;
    const distance = Math.sqrt(
      Math.pow(x2 - x1, 2) + 
      Math.pow(y2 - y1, 2) + 
      Math.pow(z2 - z1, 2)
    );
    return distance < 2; // Collision threshold
  };

  return (
    <div className="h-[600px] relative">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Physics>
          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#555555" />
          </mesh>

          {/* Vehicles */}
          {vehicles.map((vehicle, index) => (
            <Vehicle key={index} {...vehicle} />
          ))}

          {/* Traffic Lights */}
          {scenario.trafficLights.map((light, index) => (
            <TrafficLight key={index} {...light} />
          ))}

          {/* Pedestrians */}
          {scenario.pedestrians.map((ped, index) => (
            <Pedestrian key={index} {...ped} />
          ))}
        </Physics>
        <OrbitControls />
      </Canvas>

      <div className="absolute bottom-4 left-4 space-x-2">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant={isPlaying ? "destructive" : "default"}
        >
          {isPlaying ? 'Stop' : 'Start'} Simulation
        </Button>
        <Button onClick={() => {
          setVehicles(scenario.vehicles);
          setCollisions(0);
          setIsPlaying(false);
        }}>
          Reset
        </Button>
      </div>
    </div>
  );
}

// Vehicle component with physics
function Vehicle({ position, rotation, type }: Vehicle) {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    rotation,
  }));

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={type === 'car' ? [2, 1, 4] : [2.5, 2, 6]} />
      <meshStandardMaterial color={type === 'car' ? '#ff0000' : '#0000ff'} />
    </mesh>
  );
}

// Traffic Light component
function TrafficLight({ position, state }: any) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 2, 0.5]} />
      <meshStandardMaterial color="#333333" />
      <pointLight position={[0, 0, 0]} color={state} intensity={0.5} />
    </mesh>
  );
}

// Pedestrian component
function Pedestrian({ position, walking }: any) {
  return (
    <mesh position={position}>
      <capsuleGeometry args={[0.2, 1]} />
      <meshStandardMaterial color="#ffff00" />
    </mesh>
  );
}
'use client';

import { Stage, Layer, Image, Text } from 'react-konva';
import useImage from 'use-image';
import { useState, useEffect } from 'react';

interface RoadSignProps {
  imageUrl: string;
  width: number;
  height: number;
  interactive?: boolean;
  onInteract?: () => void;
}

export function RoadSign({ imageUrl, width, height, interactive, onInteract }: RoadSignProps) {
  const [image] = useImage(imageUrl);
  const [isHovered, setIsHovered] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!interactive) return;

    const animation = setInterval(() => {
      setScale(prev => prev === 1 ? 1.1 : 1);
    }, 1000);

    return () => clearInterval(animation);
  }, [interactive]);

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Image
          image={image}
          width={width * scale}
          height={height * scale}
          offsetX={(width * scale - width) / 2}
          offsetY={(height * scale - height) / 2}
          onMouseEnter={() => interactive && setIsHovered(true)}
          onMouseLeave={() => interactive && setIsHovered(false)}
          onClick={onInteract}
          opacity={isHovered ? 0.8 : 1}
          shadowColor="black"
          shadowBlur={isHovered ? 10 : 0}
          shadowOpacity={0.3}
        />
        {isHovered && (
          <Text
            text="Click to learn more"
            x={width / 2}
            y={height + 10}
            align="center"
            width={width}
            fill="#666"
          />
        )}
      </Layer>
    </Stage>
  );
}
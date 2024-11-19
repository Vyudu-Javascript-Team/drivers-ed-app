'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { FilesetResolver, ImageClassifier } from '@mediapipe/tasks-vision';

interface SignRecognitionProps {
  onRecognize: (sign: string) => void;
}

export function SignRecognition({ onRecognize }: SignRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [classifier, setClassifier] = useState<ImageClassifier | null>(null);

  useEffect(() => {
    initializeClassifier();
  }, []);

  const initializeClassifier = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      const imageClassifier = await ImageClassifier.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/road_signs_model.tflite",
        },
        maxResults: 3,
        scoreThreshold: 0.5,
      });
      
      setClassifier(imageClassifier);
    } catch (error) {
      console.error('Failed to initialize classifier:', error);
      toast.error('Failed to initialize sign recognition');
    }
  };

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        processVideoFrame();
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      toast.error('Failed to access camera');
    }
  };

  const stopCapture = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCapturing(false);
    }
  };

  const processVideoFrame = async () => {
    if (!isCapturing || !videoRef.current || !canvasRef.current || !classifier) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Draw current video frame
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Classify the image
    const classifications = classifier.classify(canvasRef.current);
    
    if (classifications.length > 0) {
      const topResult = classifications[0];
      if (topResult.score > 0.8) { // High confidence threshold
        onRecognize(topResult.categoryName);
        stopCapture();
        return;
      }
    }

    // Continue processing frames
    requestAnimationFrame(processVideoFrame);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ display: 'none' }}
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={isCapturing ? stopCapture : startCapture}
            className="w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            {isCapturing ? 'Stop Camera' : 'Start Camera'}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Point your camera at a road sign to identify it
        </p>
      </div>
    </Card>
  );
}
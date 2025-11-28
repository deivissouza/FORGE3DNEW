import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { AlertTriangle } from 'lucide-react';

interface ThreePreviewProps {
  color: string;
  fileUrl?: string | null;
  isWireframe?: boolean;
  maxPrintSize?: number; // in mm
  onDimensionsLoaded?: (dims: { x: number, y: number, z: number }, valid: boolean) => void;
}

const CameraAdjuster = ({ geometry }: { geometry: THREE.BufferGeometry }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (geometry) {
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      if (geometry.boundingSphere) {
        const center = geometry.boundingSphere.center;
        const radius = geometry.boundingSphere.radius;

        // Ajusta a câmera para enquadrar perfeitamente o modelo
        const distance = radius / Math.tan((camera as THREE.PerspectiveCamera).fov * Math.PI / 360);
        const cameraZ = distance * 1.5; // Adiciona margem

        camera.position.set(cameraZ * 0.5, cameraZ * 0.5, cameraZ);
        camera.lookAt(center.x, center.y, center.z);
        camera.updateProjectionMatrix();
      }
    }
  }, [geometry, camera]);

  return null;
};

const Model = ({ url, color, isWireframe, maxPrintSize = 250, onDimensionsLoaded }: {
  url: string,
  color: string,
  isWireframe?: boolean,
  maxPrintSize?: number,
  onDimensionsLoaded?: (dims: { x: number, y: number, z: number }, valid: boolean) => void
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  // Detecta o tipo de arquivo pela extensão
  const fileExtension = url.split('.').pop()?.toLowerCase();

  useEffect(() => {
    const loadModel = async () => {
      try {
        let loadedGeometry: THREE.BufferGeometry;

        if (fileExtension === 'stl') {
          const loader = new STLLoader();
          loadedGeometry = await new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
          });
        } else if (fileExtension === 'obj') {
          const loader = new OBJLoader();
          const object = await new Promise<THREE.Group>((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
          });

          // Extrai a geometria do OBJ
          loadedGeometry = new THREE.BufferGeometry();
          object.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              loadedGeometry = child.geometry;
            }
          });
        } else {
          // Fallback para STL se não reconhecer
          const loader = new STLLoader();
          loadedGeometry = await new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
          });
        }

        // Centraliza e calcula normais
        loadedGeometry.center();
        loadedGeometry.computeVertexNormals();
        loadedGeometry.computeBoundingBox();

        if (loadedGeometry.boundingBox) {
          const size = new THREE.Vector3();
          loadedGeometry.boundingBox.getSize(size);

          const isValid = size.x <= maxPrintSize && size.y <= maxPrintSize && size.z <= maxPrintSize;

          if (onDimensionsLoaded) {
            onDimensionsLoaded({ x: size.x, y: size.y, z: size.z }, isValid);
          }
        }

        setGeometry(loadedGeometry);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
  }, [url, fileExtension, maxPrintSize, onDimensionsLoaded]);

  if (!geometry) {
    return <Html center><div className="text-sm font-bold text-gray-500">Carregando modelo...</div></Html>;
  }

  return (
    <>
      <CameraAdjuster geometry={geometry} />
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.2}
          wireframe={isWireframe}
        />
      </mesh>
    </>
  );
};

const DemoMesh = ({ color, isWireframe }: { color: string, isWireframe?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        wireframe={isWireframe}
      />
    </mesh>
  );
};

export const ThreePreview: React.FC<ThreePreviewProps> = ({
  color,
  fileUrl,
  isWireframe,
  maxPrintSize = 250,
  onDimensionsLoaded
}) => {
  const [dimensions, setDimensions] = useState<{ x: number, y: number, z: number } | null>(null);
  const [isValid, setIsValid] = useState(true);

  const handleDimensions = (dims: { x: number, y: number, z: number }, valid: boolean) => {
    setDimensions(dims);
    setIsValid(valid);
    if (onDimensionsLoaded) {
      onDimensionsLoaded(dims, valid);
    }
  };

  return (
    <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden relative shadow-inner group">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-500 border border-gray-200 w-fit">
          {fileUrl ? 'Visualizando Arquivo' : 'Pré-visualização Interativa'}
        </div>
        {dimensions && (
          <div className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur w-fit ${isValid ? 'bg-green-100/80 text-green-700 border-green-200' : 'bg-red-100/80 text-red-700 border-red-200'}`}>
            {Math.round(dimensions.x)} x {Math.round(dimensions.y)} x {Math.round(dimensions.z)} mm
          </div>
        )}
      </div>

      {!isValid && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px] pointer-events-none">
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-xs animate-bounce-in">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-red-800">Modelo Muito Grande</h4>
              <p className="text-xs text-red-600">Máximo permitido: {maxPrintSize}mm</p>
            </div>
          </div>
        </div>
      )}

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault fov={50} position={[3, 3, 5]} />
        <Suspense fallback={<Html center><div className="text-sm font-bold text-gray-500">Carregando 3D...</div></Html>}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
          <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.3} />

          {fileUrl ? (
            <Model
              url={fileUrl}
              color={color}
              isWireframe={isWireframe}
              maxPrintSize={maxPrintSize}
              onDimensionsLoaded={handleDimensions}
            />
          ) : (
            <DemoMesh color={color} isWireframe={isWireframe} />
          )}
        </Suspense>
        <Grid
          renderOrder={-1}
          position={[0, -2, 0]}
          infiniteGrid
          cellSize={0.5}
          sectionSize={2.5}
          sectionColor={new THREE.Color(0.8, 0.8, 0.8)}
          fadeDistance={25}
        />
        <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} resolution={256} color="#000000" />
        <OrbitControls makeDefault autoRotate={!fileUrl} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

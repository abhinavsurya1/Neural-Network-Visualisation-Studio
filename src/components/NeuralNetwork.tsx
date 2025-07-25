import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { SceneManager } from '../core/SceneManager';
import { NeuralNetworkManager } from '../core/NeuralNetworkManager';
import * as THREE from 'three';

interface NeuralNetworkProps {
  width?: number;
  height?: number;
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ 
  width = 800, 
  height = 600 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const networkManagerRef = useRef<NeuralNetworkManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene manager
    sceneManagerRef.current = new SceneManager(containerRef.current);
    networkManagerRef.current = new NeuralNetworkManager(sceneManagerRef.current);

    // Create sample network
    const layerWidth = 2;
    const layerSpacing = 1.5;
    
    // Input layer
    networkManagerRef.current.createNode(
      'input1',
      0,
      new THREE.Vector3(-layerSpacing, 0.5, 0)
    );
    networkManagerRef.current.createNode(
      'input2',
      0,
      new THREE.Vector3(-layerSpacing, -0.5, 0)
    );

    // Hidden layer
    networkManagerRef.current.createNode(
      'hidden1',
      1,
      new THREE.Vector3(0, 0.5, 0)
    );
    networkManagerRef.current.createNode(
      'hidden2',
      1,
      new THREE.Vector3(0, -0.5, 0)
    );

    // Output layer
    networkManagerRef.current.createNode(
      'output1',
      2,
      new THREE.Vector3(layerSpacing, 0, 0)
    );

    // Create connections
    networkManagerRef.current.createConnection('input1', 'hidden1', 0.5);
    networkManagerRef.current.createConnection('input1', 'hidden2', 0.3);
    networkManagerRef.current.createConnection('input2', 'hidden1', 0.2);
    networkManagerRef.current.createConnection('input2', 'hidden2', 0.7);
    networkManagerRef.current.createConnection('hidden1', 'output1', 0.6);
    networkManagerRef.current.createConnection('hidden2', 'output1', 0.4);

    return () => {
      networkManagerRef.current?.dispose();
      sceneManagerRef.current?.dispose();
    };
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      gap: 2
    }}>
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2
      }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </Box>
      <Paper sx={{ 
        width: 250,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6">Controls</Typography>
        <Typography variant="body2" color="text.secondary">
          • Left click + drag to rotate
          <br />
          • Right click + drag to pan
          <br />
          • Scroll to zoom
          <br />
          • Node colors indicate layer
          <br />
          • Connection thickness shows weight
        </Typography>
      </Paper>
    </Box>
  );
};

export default NeuralNetwork; 
import * as THREE from 'three';
import { SceneManager } from './SceneManager';

interface Node {
  id: string;
  layer: number;
  position: THREE.Vector3;
  object: THREE.Mesh;
}

interface Connection {
  source: string;
  target: string;
  weight: number;
  object: THREE.Line;
}

export class NeuralNetworkManager {
  private sceneManager: SceneManager;
  private nodes: Map<string, Node> = new Map();
  private connections: Connection[] = [];
  private nodeGeometry: THREE.SphereGeometry;
  private nodeMaterial: THREE.MeshPhongMaterial;
  private connectionMaterial: THREE.LineBasicMaterial;

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
    
    // Create reusable geometries and materials
    this.nodeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    this.nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0xf48fb1,
      emissive: 0x111111,
      specular: 0xffffff,
      shininess: 30
    });
    
    this.connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x90caf9,
      transparent: true,
      opacity: 0.6
    });
  }

  public createNode(id: string, layer: number, position: THREE.Vector3): void {
    const mesh = new THREE.Mesh(this.nodeGeometry, this.nodeMaterial);
    mesh.position.copy(position);
    
    const node: Node = {
      id,
      layer,
      position,
      object: mesh
    };
    
    this.nodes.set(id, node);
    this.sceneManager.add(mesh);
  }

  public createConnection(sourceId: string, targetId: string, weight: number): void {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    
    if (!source || !target) return;
    
    const points = [
      source.position,
      target.position
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, this.connectionMaterial);
    line.scale.setScalar(Math.abs(weight));
    
    const connection: Connection = {
      source: sourceId,
      target: targetId,
      weight,
      object: line
    };
    
    this.connections.push(connection);
    this.sceneManager.add(line);
  }

  public updateConnectionWeight(sourceId: string, targetId: string, weight: number): void {
    const connection = this.connections.find(
      c => c.source === sourceId && c.target === targetId
    );
    
    if (connection) {
      connection.weight = weight;
      connection.object.scale.setScalar(Math.abs(weight));
    }
  }

  public updateNodePosition(id: string, position: THREE.Vector3): void {
    const node = this.nodes.get(id);
    if (node) {
      node.position.copy(position);
      node.object.position.copy(position);
      
      // Update connected lines
      this.connections.forEach(connection => {
        if (connection.source === id || connection.target === id) {
          const source = this.nodes.get(connection.source);
          const target = this.nodes.get(connection.target);
          
          if (source && target) {
            const points = [source.position, target.position];
            connection.object.geometry.setFromPoints(points);
          }
        }
      });
    }
  }

  public dispose(): void {
    this.nodes.forEach(node => {
      this.sceneManager.remove(node.object);
      node.object.geometry.dispose();
      (node.object.material as THREE.Material).dispose();
    });
    
    this.connections.forEach(connection => {
      this.sceneManager.remove(connection.object);
      connection.object.geometry.dispose();
      connection.object.material.dispose();
    });
    
    this.nodeGeometry.dispose();
    this.nodeMaterial.dispose();
    this.connectionMaterial.dispose();
  }
} 
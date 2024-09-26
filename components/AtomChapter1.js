"use client";
import { useState, useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export default function AtomChapter1() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentAnimationGroup, setCurrentAnimationGroup] = useState(null);
  let currentMesh = null;
  let gridParent = null;

  const playAudio = (audioPath) => {
    return new Promise((resolve) => {
      const audio = new Audio(audioPath);
      audio.volume = 1;
      audio.play();
      audio.onended = () => {
        resolve();
      };
      setAudio(audio);
    });
  };

  const initializeBabylon = () => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new BABYLON.Color3(1, 1, 1);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      15,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
    light.intensity = 1.5;

    const loadGLB = (path, scale = 1) => {
      return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh(
          null,
          "/0/",
          path,
          scene,
          (meshes, particleSystems, skeletons, animationGroups) => {
            if (meshes && meshes.length > 0) {
              if (currentMesh) {
                currentMesh.dispose();
              }
              currentMesh = meshes[0];
              currentMesh.scaling = new BABYLON.Vector3(scale, scale, scale);

              if (animationGroups && animationGroups.length > 0) {
                const animationGroup = animationGroups[0];
                setCurrentAnimationGroup(animationGroup);
                if (!isPaused) {
                  animationGroup.play(true); 
                }
              }
              resolve();
            }
          },
          null,
          (scene, message) => reject(message)
        );
      });
    };

    const createSphereGrid = (rotationAngle = 0) => {
      const sphereDiameter = 1;
      const rows = 10;
      const columns = 10;

      const rowOffset = (rows - 1) * sphereDiameter / 2;
      const columnOffset = (columns - 1) * sphereDiameter / 2;

      const parent = new BABYLON.Mesh("parent", scene);
      gridParent = parent;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          const sphere = BABYLON.MeshBuilder.CreateSphere(
            `sphere_${i}_${j}`,
            { diameter: sphereDiameter },
            scene
          );
          sphere.position = new BABYLON.Vector3(
            i * sphereDiameter - rowOffset,
            0,
            j * sphereDiameter - columnOffset
          );
          sphere.parent = parent;
        }
      }
      parent.rotation.x = rotationAngle;
    };

    const runSequence = async () => {
      const sequences = [
        { audio: "/0/audio/1.aac", model: "welcome(c).glb", scale: 1 },
        { audio: "/0/audio/2.aac", model: "combined_atom_molecule_microscope(c).glb" },
        { audio: "/0/audio/3.aac", action: () => createSphereGrid(Math.PI / 4) },
        { audio: "/0/audio/4.aac", model: "sphere(c).glb" },
        { audio: "/0/audio/5.aac", model: "atom(c).glb", scale: 1.5, position: { y: 0 }, rotation: { y: Math.PI / 2 } },
        { audio: "/0/audio/6.aac", model: "nucleus_atom(c).glb", scale: 1.5 },
        { audio: "/0/audio/7.aac", model: "labeled_atom(c).glb", scale: 1.5 },
        { audio: "/0/audio/8.aac", model: "structure_atom_1(c).glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/9.aac", model: "electron_atom(c).glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/10.aac", model: "Periodic_Table(c).glb", scale: 2.5 },
        { audio: "/0/audio/11.aac", model: "carbon_example(c).glb", scale: 1.5 },
        { audio: "/0/audio/12.aac", model: "isotops(c).glb", scale: 1.5 },
        { audio: "/0/audio/13.aac", model: "ion_1.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/14.aac", model: "cation.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/15.aac", model: "anion.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/16.aac", model: "atom_bond.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/17.aac", model: "rotate_atom.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/18.aac", model: "ionic.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/19.aac", model: "covalent.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/0/audio/20.aac", model: "metal_bond.glb", scale: 1.5 },
      ];

      for (const sequence of sequences) {
        const audioPromise = playAudio(sequence.audio);

        if (sequence.model) {
          await loadGLB(sequence.model, sequence.scale);

          if (currentMesh) {
            if (sequence.position) {
              currentMesh.position.y += sequence.position.y;
            }
            if (sequence.rotation) {
              currentMesh.rotation.y = sequence.rotation.y;
            }
          }
        } else if (sequence.action) {
          sequence.action();
        }

        await audioPromise;

        if (currentMesh) {
          currentMesh.dispose();
          currentMesh = null;
        }

        if (gridParent) {
          gridParent.dispose();
          gridParent = null;
        }
      }
    };

    runSequence();

    engine.runRenderLoop(() => {
      if (scene && !scene.isDisposed) {
        if (!isPaused) {
          scene.render();
        }
      }
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      if (scene) {
        scene.dispose();
      }
      if (engine) {
        engine.dispose();
      }
    };
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);

    if (audio) {
      if (isPaused) {
        audio.play(); 
      } else {
        audio.pause();
      }
    }

    if (currentAnimationGroup) {
      if (isPaused) {
        currentAnimationGroup.play(true);
        console.log("Resuming animation group");
      } else {
        currentAnimationGroup.pause();
        console.log("Pausing animation group");
      }
    }
  };

  useEffect(() => {
    if (started) {
      initializeBabylon();
    }
  }, [started]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          style={{
            padding: "20px 40px",
            fontSize: "24px",
            cursor: "pointer",
            backgroundColor: "blue",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Start
        </button>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: "white",
              border: "2px solid black",
            }}
          ></canvas>
          <button
            onClick={togglePause}
            className="p-3 flex justify-center items-center cursor-pointer text-white rounded-full border-2 border-black "
          >
            {isPaused ? (
             <svg width="30px" height="30px" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg" transform="translate(2, 0)">
             <path d="M5 3L19 12L5 21V3Z" stroke="#1C274C" stroke-width="1.5" fill="black" />
         </svg>         
            ) : (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6c0-1.886 0-2.829.586-3.414C3.172 2 4.114 2 6 2s2.828 0 3.414.586C10 3.172 10 4.114 10 6v12c0 1.886 0 2.829-.586 3.414C8.828 22 7.886 22 6 22s-2.828 0-3.414-.586C2 20.828 2 19.886 2 18V6z" stroke="#1C274C" stroke-width="1.5" fill="black" />
                <path d="M14 6c0-1.886 0-2.829.586-3.414C15.172 2 16.114 2 18 2s2.828 0 3.414.586C22 3.172 22 4.114 22 6v12c0 1.886 0 2.829-.586 3.414C20.828 22 19.886 22 18 22s-2.828 0-3.414-.586C14 20.828 14 19.886 14 18V6z" stroke="#1C274C" stroke-width="1.5" fill="black" />
              </svg>
            )}
          </button>
        </>
      )}
    </div>
  );
}

"use client";
// It is a course component which will be redirected in chapter/[course], In future I will make more tough concepts' courses
import { useState, useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export default function Atom() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const initialCameraStateRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentAnimationGroup, setCurrentAnimationGroup] = useState(null);
  let currentMesh = null;
  let gridParent = null;
  const [isPortrait, setIsPortrait] = useState(false);

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
    cameraRef.current = camera;

    // Store the initial camera state in a mutable ref
    initialCameraStateRef.current = {
      alpha: camera.alpha,
      beta: camera.beta,
      radius: camera.radius,
      target: camera.target.clone(),
    };

    const resetCamera = () => {
      camera.alpha = initialCameraStateRef.current.alpha;
      camera.beta = initialCameraStateRef.current.beta;
      camera.radius = initialCameraStateRef.current.radius;
      camera.target = initialCameraStateRef.current.target.clone();
    };

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
          "",
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
        { audio: "/1.mp3", model: "https://sakshamwithweb.github.io/3d_models/welcome.glb", scale: 1 },
        { audio: "/2.mp3", model: "https://sakshamwithweb.github.io/3d_models/combined_atom_molecule_microscope.glb" },
        { audio: "/3.mp3", action: () => createSphereGrid(Math.PI / 4) },
        { audio: "/4.mp3", model: "https://sakshamwithweb.github.io/3d_models/sphere.glb" },
        { audio: "/5.mp3", model: "https://sakshamwithweb.github.io/3d_models/atom.glb", scale: 1.5, position: { y: 0 }, rotation: { y: -Math.PI / 2 } },
        { audio: "/6.mp3", model: "https://sakshamwithweb.github.io/3d_models/nucleus_atom.glb", scale: 1.5 },
        { audio: "/7.mp3", model: "https://sakshamwithweb.github.io/3d_models/labeled_atom.glb", scale: 1.5 },
        { audio: "/8.mp3", model: "https://sakshamwithweb.github.io/3d_models/structure_atom_1.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/9.mp3", model: "https://sakshamwithweb.github.io/3d_models/electron_atom.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/10.mp3", model: "https://sakshamwithweb.github.io/3d_models/Periodic_Table.glb", scale: 2.5 },
        { audio: "/11.mp3", model: "https://sakshamwithweb.github.io/3d_models/carbon_example.glb", scale: 2.5 },
        { audio: "/12.mp3", model: "https://sakshamwithweb.github.io/3d_models/isotops.glb", scale: 2 },
        { audio: "/13.mp3", model: "https://sakshamwithweb.github.io/3d_models/ion_1.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/14.mp3", model: "https://sakshamwithweb.github.io/3d_models/cation.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/15.mp3", model: "https://sakshamwithweb.github.io/3d_models/anion.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/16.mp3", model: "https://sakshamwithweb.github.io/3d_models/atom_bond.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/17.mp3", model: "https://sakshamwithweb.github.io/3d_models/rotate_atom.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/18.mp3", model: "https://sakshamwithweb.github.io/3d_models/ionic.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/19.mp3", model: "https://sakshamwithweb.github.io/3d_models/covalent.glb", scale: 1.5, position: { y: -2 } },
        { audio: "/20.mp3", model: "https://sakshamwithweb.github.io/3d_models/metal_bond.glb", scale: 1.5 },
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
              currentMesh.rotationQuaternion = null;
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
      } else {
        currentAnimationGroup.pause();
      }
    }
  };

  useEffect(() => {
    if (started) {
      initializeBabylon();
    }
  }, [started]);


  useEffect(() => {
    const interval = setInterval(() => {
      const Portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(Portrait);
    }, 1);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(isPortrait)
  }, [isPortrait]);


  return (
    <div className={`flex flex-col items-center ${isPortrait ? "" : "justify-center"} h-screen`}>
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className="px-10 m-auto py-5 text-2xl cursor-pointer bg-blue-500 text-white rounded-lg border-none"
        >
          Start
        </button>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className={`bg-white border-2 border-black ${isPortrait ? 'w-screen h-[30%]' : 'w-[90%] h-[90%]'}`}
          ></canvas>
          <div className="flex">
            <button
              onClick={togglePause}
              className="p-3 m-1 flex justify-center items-center cursor-pointer text-white rounded-full border-2 border-black"
            >
              {isPaused ? (
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg" transform="translate(2, 0)">
                  <path d="M5 3L19 12L5 21V3Z" stroke="#1C274C" strokeWidth="1.5" fill="black" />
                </svg>
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6c0-1.886 0-2.829.586-3.414C3.172 2 4.114 2 6 2s2.828 0 3.414.586C10 3.172 10 4.114 10 6v12c0 1.886 0 2.829-.586 3.414C8.828 22 7.886 22 6 22s-2.828 0-3.414-.586C2 20.828 2 19.886 2 18V6z" stroke="#1C274C" stroke-width="1.5" fill="black" />
                  <path d="M14 6c0-1.886 0-2.829.586-3.414C15.172 2 16.114 2 18 2s2.828 0 3.414.586C22 3.172 22 4.114 22 6v12c0 1.886 0 2.829-.586 3.414C20.828 22 19.886 22 18 22s-2.828 0-3.414-.586C14 20.828 14 19.886 14 18V6z" stroke="#1C274C" stroke-width="1.5" fill="black" />
                </svg>
              )}
            </button>
            <button
              className="bottom-2 right-2 p-2.5 border-none rounded-md cursor-pointer"

              onClick={() => {
                const camera = cameraRef.current;
                if (camera && initialCameraStateRef.current) {
                  camera.alpha = initialCameraStateRef.current.alpha;
                  camera.beta = initialCameraStateRef.current.beta;
                  camera.radius = initialCameraStateRef.current.radius;
                  camera.target = initialCameraStateRef.current.target.clone();
                }
              }}>
              <svg fill="#000000" width="40px" height="40px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                <path d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0" fill-rule="evenodd" />
              </svg>
            </button>
          </div>

        </>
      )}
    </div>
  );
}

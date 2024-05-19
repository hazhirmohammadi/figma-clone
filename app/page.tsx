"use client";
import { fabric } from "fabric";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSideBar from "@/components/RightSideBar";
import { useEffect, useRef, useState } from "react";
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp, handleCanvasObjectModified, handlePathCreated,
  handleResize,
  initializeFabric, renderCanvas,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";

export default function Page() {
  const undo = useUndo();
  const redo = useRedo();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.canvas | null>(null);
  const isDrawing = useRef(false);
  const activeObjectRef = useRef<fabric.object | null>(null);
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;

    // @ts-ignore
    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }

    return canvasObjects.size === 0;
  }, []);

  const deleteShapeFromStorage = useMutation(({ storage }, objectId) => {
    const canvasObjects = storage.get("canvasObjects");

    canvasObjects.delete(objectId);
  });
  const handleActiveElement = (elm: ActiveElement) => {
    setActiveElement(elm);
    // @ts-ignore
    selectedShapeRef.current = elm?.value as String;

    switch (elm?.value) {
      case "reset":
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;
      case "delete":
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
      default:
        break;


    }
  };

  const shapeRef = useRef<fabric.object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");

  const canvasObjects = useStorage((root) => root.canvasObjects);
  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, shapeData);

  }, []);

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options: any) => {
      handleCanvasMouseDown(
        {
          options,
          canvas,
          isDrawing,
          shapeRef,
          selectedShapeRef,
        });
    });
    canvas.on("mouse:move", (options: any) => {
      handleCanvaseMouseMove(
        {
          options,
          canvas,
          isDrawing,
          shapeRef,
          selectedShapeRef,
          syncShapeInStorage,
        });
    });
    canvas.on("mouse:move", (options: any) => {
      handleCanvasMouseUp(
        {
          // @ts-ignore
          options,
          canvas,
          isDrawing,
          shapeRef,
          selectedShapeRef,
          syncShapeInStorage,
          setActiveElement,
          activeObjectRef,
        });
    });
    canvas.on("object:up", (options:any) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });
    canvas.on("object:modified", (options:any) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });
    canvas.on("path:created", (options:any) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });


    window.addEventListener("resize", () => {
      // handleResize({fabricRef})
    });
    window.removeEventListener("keydown", (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    );
    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);
  return (
    <main className="h-screen overflow-hidden ">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />
      <section className="flex h-full flex-row">
        <LeftSidebar
          allShapes={Array.from(canvasObjects)}
        />
        <Live canvasRef={canvasRef} />
        <RightSideBar />

      </section>

    </main>
  );
}
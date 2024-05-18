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
  handleCanvasMouseUp, handleCanvasObjectModified,
  handleResize,
  initializeFabric, renderCanvas,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import { useMutation, useStorage } from "@/liveblocks.config";

export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.canvas | null>(null);
  const isDrawing = useRef(false);
  const activeObjectRef = useRef<fabric.object | null>(null);
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });
  const handleActiveElement = (elm: ActiveElement) => {
    setActiveElement(elm);
    selectedShapeRef.current = elm?.value as String;
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

    canvas.on("object:up", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });
    window.addEventListener("resize", () => {
      // handleResize({fabricRef})
    });
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
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSideBar />

      </section>

    </main>
  );
}
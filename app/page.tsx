"use client";
import { fabric } from "fabric";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import { useEffect, useRef } from "react";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.canvas|null>(null);
  const isDrawing = useRef(false);

  const shapeRef = useRef<fabric.object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) => {
      console.log(77);
      handleCanvasMouseDown(
        {
          options,
          canvas,
          isDrawing,
          shapeRef,
          selectedShapeRef,
        });
    });
    window.addEventListener("resize",()=>{
      // handleResize({fabricRef})
    })
  }, []);
  return (
    <main className="h-screen overflow-hidden ">
      <Navbar />
      <section className="flex h-full flex-row">
        <LeftSideBar />
        <Live canvasRef={canvasRef}/>
        <RightSideBar />

      </section>

    </main>
  );
}
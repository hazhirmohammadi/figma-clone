import React, { useCallback, useEffect, useState } from "react";
import LiveCursor from "@/components/cursor/LiveCursor";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import CursorChat from "@/components/cursor/CursorChat";
import { CursorMode } from "@/types/type";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden,
  });
  const handelPointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });
  }, []);

  const handelPointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden });
    event.preventDefault();
    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handelPointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });
  }, []);
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      }

    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };
    window.addEventListener("keyup",onKeyUp)
    window.addEventListener("keydown",onKeyDown)

    return ()=>{
      window.removeEventListener("keyup",onKeyUp);
      window.removeEventListener("keydown",onKeyDown);
    }
  }, [updateMyPresence]);
  return (
    <div
      onPointerMove={handelPointerMove}
      onPointerDown={handelPointerDown}
      onPointerLeave={handelPointerLeave}
      className="w-full h-[100vh] text-center flex justify-center items-center"
    >
      <h1 className="text-2xl text-white "> LiveBlocks Figma clone</h1>
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      <LiveCursor others={others} />
    </div>
  );
};

export default Live;

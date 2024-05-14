import React, { useCallback } from "react";
import LiveCursor from "@/components/cursor/LiveCursor";
import { useMyPresence, useOthers } from "@/liveblocks.config";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  const handelPointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });
  }, []);

  const handelPointerLeave = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handelPointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });
  }, []);
  return (
    <div
      onPointerMove={handelPointerMove}
      onPointerDown={handelPointerDown}
      onPointerLeave={handelPointerLeave}
      className="w-full h-[100vh] text-center flex justify-center items-center "
    >
      <h1 className="text-2xl text-white "> LiveBlocks Figma clone</h1>

      <LiveCursor others={others} />
    </div>
  );
};

export default Live;

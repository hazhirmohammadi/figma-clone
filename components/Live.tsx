import React, { useCallback, useEffect, useState } from "react";
import LiveCursor from "@/components/cursor/LiveCursor";
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@/liveblocks.config";
import CursorChat from "@/components/cursor/CursorChat";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import ReactionSelector from "@/components/reaction/ReactionButton";
import FlyingReaction from "@/components/reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}
const Live = ({ canvasRef }: Props) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const broadcast = useBroadcastEvent();

  useInterval(() => {
    setReactions((reaction) => reaction.filter((r) =>
      r.timestamp > Date.now() - 400,
    ));
  }, 1000);

  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      setReactions((reactions) => reactions.concat({
        point: { x: cursor.x, y: cursor.y },
        value: cursorState.reaction,
        timestamp: Date.now(),
      }));

      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  const handelPointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {

      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: { x, y } });
    }
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

    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? {
        ...state,
        isPressed: true,
      } : state,
    );
  }, [cursorState.mode, setCursorState]);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? {
      ...state,
      isPressed: true,
    } : state);
  }, [cursorState.mode, setCursorState]);

  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {

        setCursorState({
          mode: CursorMode.Chat,
          // @ts-ignore
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setCursorState({
          mode: CursorMode.ReactionSelector,

        });
      }

    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) => reactions.concat({
      point: { x: event.x, y: event.y },
      value: event.value,
      timestamp: Date.now(),
    }));
  });

  return (
    <div
      id="canvas"
      onPointerMove={handelPointerMove}
      onPointerDown={handelPointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handelPointerLeave}
      className="w-full h-[100vh] text-center flex justify-center items-center"
    >
      <canvas ref={canvasRef} />

      {
        reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))
      }

      {cursor && (
        <CursorChat
          cursor={cursor}
          // @ts-ignore
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          setReaction={setReaction}
        />
      )}

      <LiveCursor others={others} />
    </div>
  );
};

export default Live;

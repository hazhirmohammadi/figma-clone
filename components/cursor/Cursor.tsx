import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
  color: String,
  x: Number,
  y: Number,
  message: String
}
const Cursor = ({ color, x, y, message }: Props) => {
  return (
    <div className="pointer-events-none absolute top-0 left-0"
    style={{transform:`translateX(${x}px) translateY(${y}px)`,}}>
      <CursorSVG
        // @ts-ignore
        color={color}
      />

      {message&&(
        // @ts-ignore
        <div className="absolute left-0 top-5 rounded-3xl px-4 py-2 " style={{backgroundColor:color}}>
          <p className="text-white whitespace-nowrap text-sm leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Cursor;

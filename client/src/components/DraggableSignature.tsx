import { useDraggable } from "@dnd-kit/core";

export default function DraggableSignature({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    position: "absolute" as const,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

return (
  <div
    ref={setNodeRef}
    style={style}
    {...listeners}
    {...attributes}
    className="draggable-sig-tool" // 🔥 FIX: Applied standard CSS class
  >
    Drag Signature
  </div>
);
}
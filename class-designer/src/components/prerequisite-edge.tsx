import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { ChevronDown } from 'lucide-react';

export function PrerequisiteEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 10,
    offset: 8,
  });

  return (
    <>
      <path d={path} className="prerequisite-edge-outline" />
      <BaseEdge
        id={id}
        path={path}
        interactionWidth={20}
        style={{ stroke: '#f0c96f', strokeWidth: 4 }}
      />
      <EdgeLabelRenderer>
        <span
          className="prerequisite-edge-arrow nodrag nopan"
          style={{ transform: `translate(-50%, -100%) translate(${targetX}px, ${targetY + 2}px)` }}
          aria-hidden="true"
        >
          <ChevronDown className="prerequisite-edge-arrow-outline" size={20} strokeWidth={6} />
          <ChevronDown className="prerequisite-edge-arrow-glyph" size={16} strokeWidth={4} />
        </span>
      </EdgeLabelRenderer>
    </>
  );
}

interface Panel {
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: 'horizontal' | 'vertical';
}

interface RoofVisualizationProps {
  roofWidth: number;
  roofHeight: number;
  panels: Panel[];
}

export default function RoofVisualization({ roofWidth, roofHeight, panels }: RoofVisualizationProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <svg
        viewBox={`0 0 ${roofWidth} ${roofHeight}`}
        className="w-full h-auto border-2 border-gray-300 rounded bg-white"
        style={{ maxHeight: "400px" }}
      >
        {/* Techo */}
        <rect
          x="0"
          y="0"
          width={roofWidth}
          height={roofHeight}
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth="0.02"
        />

        {/* Paneles */}
        {panels.map((panel, index) => (
          <rect
            key={index}
            x={panel.x}
            y={panel.y}
            width={panel.width}
            height={panel.height}
            fill={panel.orientation === 'horizontal' ? '#3b82f6' : '#a855f7'}
            stroke={panel.orientation === 'horizontal' ? '#1e40af' : '#7e22ce'}
            strokeWidth="0.01"
            opacity="0.85"
          />
        ))}
      </svg>
      
      <div className="flex gap-4 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Horizontal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Vertical</span>
        </div>
      </div>
    </div>
  );
}


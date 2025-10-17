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
  spacing?: number;
}

export default function RoofVisualization({ roofWidth, roofHeight, panels, spacing = 0 }: RoofVisualizationProps) {
  // Generara rectángulos para visualizar los gaps entre paneles
  const gapRects = [];
  if (spacing > 0) {
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      
      // Gap a la derecha del panel (solo si no es el último de su fila)
      if (panel.x + panel.width + spacing <= roofWidth) {
        gapRects.push({
          x: panel.x + panel.width,
          y: panel.y,
          width: spacing,
          height: panel.height,
          type: 'right'
        });
      }
      
      // Gap abajo del panel (solo si no es el último de su columna)
      if (panel.y + panel.height + spacing <= roofHeight) {
        gapRects.push({
          x: panel.x,
          y: panel.y + panel.height,
          width: panel.width,
          height: spacing,
          type: 'bottom'
        });
      }
    }
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <svg
        viewBox={`0 0 ${roofWidth} ${roofHeight}`}
        className="w-full h-auto border-2 border-gray-300 rounded bg-white"
        style={{ maxHeight: "400px" }}
      >
        {/* TECHO */}
        <rect
          x="0"
          y="0"
          width={roofWidth}
          height={roofHeight}
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth="0.02"
        />

        {/* GAPS - mostrar en color diferente */}
        {gapRects.map((gap, index) => (
          <rect
            key={`gap-${index}`}
            x={gap.x}
            y={gap.y}
            width={gap.width}
            height={gap.height}
            fill="#fbbf24"
            opacity="0.6"
          />
        ))}

        {/* PANELES */}
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
      
      <div className="flex gap-4 mt-3 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Horizontal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Vertical</span>
        </div>
        {spacing > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-400 rounded opacity-60"></div>
            <span>GAP ({spacing}m)</span>
          </div>
        )}
      </div>
    </div>
  );
}


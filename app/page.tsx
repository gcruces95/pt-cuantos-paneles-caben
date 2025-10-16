"use client";

import { useState } from "react";

export default function Home() {
	const [roofWidth, setRoofWidth] = useState("5");
	const [roofHeight, setRoofHeight] = useState("3");
	const [panelWidth, setPanelWidth] = useState("1");
	const [panelHeight, setPanelHeight] = useState("2");

	const [horizontalCount, setHorizontalCount] = useState(0);
	const [verticalCount, setVerticalCount] = useState(0);

	const calculatePanels = () => {
		const rWidth = parseFloat(roofWidth);
		const rHeight = parseFloat(roofHeight);
		const pWidth = parseFloat(panelWidth);
		const pHeight = parseFloat(panelHeight);

		if (
			isNaN(rWidth) ||
			isNaN(rHeight) ||
			isNaN(pWidth) ||
			isNaN(pHeight) ||
			rWidth <= 0 ||
			rHeight <= 0 ||
			pWidth <= 0 ||
			pHeight <= 0
		) {
			alert("Por favor ingresa valores válidos y positivos");
			return;
		}

		// Orientación horizontal
		const hCols = Math.floor(rWidth / pWidth);
		const hRows = Math.floor(rHeight / pHeight);
		const horizontal = hCols * hRows;

		// Orientación vertical
		const vCols = Math.floor(rWidth / pHeight);
		const vRows = Math.floor(rHeight / pWidth);
		const vertical = vCols * vRows;

		setHorizontalCount(horizontal);
		setVerticalCount(vertical);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Calculadora de Paneles Solares
				</h1>

				<div className="space-y-4">
					<div>
						<h2 className="text-xl font-semibold mb-3">
							Dimensiones del Techo
						</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Ancho (m)
								</label>
								<input
									type="number"
									step="0.1"
									value={roofWidth}
									onChange={(e) =>
										setRoofWidth(e.target.value)
									}
									className="w-full px-3 py-2 border rounded"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Alto (m)
								</label>
								<input
									type="number"
									step="0.1"
									value={roofHeight}
									onChange={(e) =>
										setRoofHeight(e.target.value)
									}
									className="w-full px-3 py-2 border rounded"
								/>
							</div>
						</div>
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-3">
							Dimensiones del Panel
						</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Ancho (m)
								</label>
								<input
									type="number"
									step="0.01"
									value={panelWidth}
									onChange={(e) =>
										setPanelWidth(e.target.value)
									}
									className="w-full px-3 py-2 border rounded"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Alto (m)
								</label>
								<input
									type="number"
									step="0.01"
									value={panelHeight}
									onChange={(e) =>
										setPanelHeight(e.target.value)
									}
									className="w-full px-3 py-2 border rounded"
								/>
							</div>
						</div>
					</div>

					<button
						onClick={calculatePanels}
						className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
					>
						Calcular
					</button>

					{(horizontalCount > 0 || verticalCount > 0) && (
						<div className="mt-6 p-4 bg-gray-50 rounded-lg">
							<h2 className="text-xl font-semibold mb-3">
								Resultados
							</h2>
							<div className="space-y-2">
								<p className="text-lg">
									<span className="font-medium">
										Orientación Horizontal:
									</span>{" "}
									{horizontalCount} paneles
								</p>
								<p className="text-lg">
									<span className="font-medium">
										Orientación Vertical:
									</span>{" "}
									{verticalCount} paneles
								</p>
								<p className="text-lg font-bold mt-4">
									Mejor opción:{" "}
									{horizontalCount >= verticalCount
										? `Horizontal (${horizontalCount})`
										: `Vertical (${verticalCount})`}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

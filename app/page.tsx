"use client";

import { useState } from "react";
import RoofVisualization from "@/app/components/RoofVisualization";

interface Panel {
	x: number;
	y: number;
	width: number;
	height: number;
	orientation: "horizontal" | "vertical";
}

export default function Home() {
	const [roofWidth, setRoofWidth] = useState("5");
	const [roofHeight, setRoofHeight] = useState("3");
	const [panelWidth, setPanelWidth] = useState("1");
	const [panelHeight, setPanelHeight] = useState("2");
	const [spacing, setSpacing] = useState("0");

	const [horizontalCount, setHorizontalCount] = useState(0);
	const [verticalCount, setVerticalCount] = useState(0);
	const [mixedCount, setMixedCount] = useState(0);
	const [mixedDetails, setMixedDetails] = useState({
		horizontal: 0,
		vertical: 0,
	});
	const [panels, setPanels] = useState<Panel[]>([]);
	const [horizontalPanels, setHorizontalPanels] = useState<Panel[]>([]);
	const [verticalPanels, setVerticalPanels] = useState<Panel[]>([]);
	const [mixedPanels, setMixedPanels] = useState<Panel[]>([]);
	const [selectedView, setSelectedView] = useState<
		"horizontal" | "vertical" | "mixed"
	>("horizontal");

	const generatePanels = (
		rWidth: number,
		rHeight: number,
		pWidth: number,
		pHeight: number,
		gap: number,
		orientation: "horizontal" | "vertical" | "mixed"
	): Panel[] => {
		const result: Panel[] = [];

		if (orientation === "horizontal") {
			const cols = Math.floor((rWidth + gap) / (pWidth + gap));
			const rows = Math.floor((rHeight + gap) / (pHeight + gap));
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					result.push({
						x: col * (pWidth + gap),
						y: row * (pHeight + gap),
						width: pWidth,
						height: pHeight,
						orientation: "horizontal",
					});
				}
			}
		} else if (orientation === "vertical") {
			const cols = Math.floor((rWidth + gap) / (pHeight + gap));
			const rows = Math.floor((rHeight + gap) / (pWidth + gap));
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					result.push({
						x: col * (pHeight + gap),
						y: row * (pWidth + gap),
						width: pHeight,
						height: pWidth,
						orientation: "vertical",
					});
				}
			}
		} else {
			// MIXTO: Generará la mejor combinación de paneles horizontales y verticales
			const maxHRows = Math.floor((rHeight + gap) / (pHeight + gap));
			let maxPanels = 0;
			let bestPanels: Panel[] = [];

			for (let hRows = 0; hRows <= maxHRows; hRows++) {
				const tempPanels: Panel[] = [];
				const hCols = Math.floor((rWidth + gap) / (pWidth + gap));

				// Paneles horizontales
				for (let row = 0; row < hRows; row++) {
					for (let col = 0; col < hCols; col++) {
						tempPanels.push({
							x: col * (pWidth + gap),
							y: row * (pHeight + gap),
							width: pWidth,
							height: pHeight,
							orientation: "horizontal",
						});
					}
				}

				// Paneles verticales en el espacio restante
				const usedHeight = hRows * (pHeight + gap);
				const remainingHeight = rHeight - usedHeight;
				const vRows = Math.floor(remainingHeight / (pWidth + gap));
				const vCols = Math.floor((rWidth + gap) / (pHeight + gap));

				for (let row = 0; row < vRows; row++) {
					for (let col = 0; col < vCols; col++) {
						tempPanels.push({
							x: col * (pHeight + gap),
							y: usedHeight + row * (pWidth + gap),
							width: pHeight,
							height: pWidth,
							orientation: "vertical",
						});
					}
				}

				if (tempPanels.length > maxPanels) {
					maxPanels = tempPanels.length;
					bestPanels = [...tempPanels];
				}
			}

			return bestPanels;
		}

		return result;
	};

	const calculateMixed = (
		rWidth: number,
		rHeight: number,
		pWidth: number,
		pHeight: number,
		gap: number
	) => {
		let maxPanels = 0;
		let bestH = 0;
		let bestV = 0;

		const maxHRows = Math.floor((rHeight + gap) / (pHeight + gap));

		for (let hRows = 0; hRows <= maxHRows; hRows++) {
			const hCols = Math.floor((rWidth + gap) / (pWidth + gap));
			const hPanels = hRows * hCols;

			const usedHeight = hRows * (pHeight + gap);
			const remainingHeight = rHeight - usedHeight;

			const vRows = Math.floor(remainingHeight / (pWidth + gap));
			const vCols = Math.floor((rWidth + gap) / (pHeight + gap));
			const vPanels = vRows * vCols;

			const total = hPanels + vPanels;

			if (total > maxPanels) {
				maxPanels = total;
				bestH = hPanels;
				bestV = vPanels;
			}
		}

		return { total: maxPanels, horizontal: bestH, vertical: bestV };
	};

	const calculatePanels = () => {
		const rWidth = parseFloat(roofWidth);
		const rHeight = parseFloat(roofHeight);
		const pWidth = parseFloat(panelWidth);
		const pHeight = parseFloat(panelHeight);
		const gap = parseFloat(spacing);

		if (
			isNaN(rWidth) ||
			isNaN(rHeight) ||
			isNaN(pWidth) ||
			isNaN(pHeight) ||
			isNaN(gap) ||
			rWidth <= 0 ||
			rHeight <= 0 ||
			pWidth <= 0 ||
			pHeight <= 0 ||
			gap < 0
		) {
			alert("Por favor ingresa valores válidos y positivos");
			return;
		}

		// Orientación horizontal
		const hCols = Math.floor((rWidth + gap) / (pWidth + gap));
		const hRows = Math.floor((rHeight + gap) / (pHeight + gap));
		const horizontal = hCols * hRows;

		// Orientación vertical
		const vCols = Math.floor((rWidth + gap) / (pHeight + gap));
		const vRows = Math.floor((rHeight + gap) / (pWidth + gap));
		const vertical = vCols * vRows;

		// Orientación mixta
		const mixed = calculateMixed(rWidth, rHeight, pWidth, pHeight, gap);

		setHorizontalCount(horizontal);
		setVerticalCount(vertical);
		setMixedCount(mixed.total);
		setMixedDetails({
			horizontal: mixed.horizontal,
			vertical: mixed.vertical,
		});

		// Generara paneles para las tres orientaciones
		const hPanels = generatePanels(
			rWidth,
			rHeight,
			pWidth,
			pHeight,
			gap,
			"horizontal"
		);
		const vPanels = generatePanels(
			rWidth,
			rHeight,
			pWidth,
			pHeight,
			gap,
			"vertical"
		);
		const mPanels = generatePanels(
			rWidth,
			rHeight,
			pWidth,
			pHeight,
			gap,
			"mixed"
		);

		setHorizontalPanels(hPanels);
		setVerticalPanels(vPanels);
		setMixedPanels(mPanels);

		// Determinar la mejor opción y establecerla como vista inicial
		let bestOrientation: "horizontal" | "vertical" | "mixed" = "horizontal";
		const max = Math.max(horizontal, vertical, mixed.total);
		if (max === mixed.total) bestOrientation = "mixed";
		else if (max === vertical) bestOrientation = "vertical";

		setSelectedView(bestOrientation);
		setPanels(
			bestOrientation === "horizontal"
				? hPanels
				: bestOrientation === "vertical"
				? vPanels
				: mPanels
		);
	};

	const bestOption = () => {
		const max = Math.max(horizontalCount, verticalCount, mixedCount);
		if (max === mixedCount) return `Mixta (${mixedCount})`;
		if (max === horizontalCount) return `Horizontal (${horizontalCount})`;
		return `Vertical (${verticalCount})`;
	};

	const isBestOption = (option: "horizontal" | "vertical" | "mixed") => {
		const max = Math.max(horizontalCount, verticalCount, mixedCount);
		if (option === "horizontal") return horizontalCount === max;
		if (option === "vertical") return verticalCount === max;
		return mixedCount === max;
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
					Calculadora de Paneles Solares
				</h1>
				<div className="grid md:grid-cols-2 gap-6">
					{/* Panel de entrada */}
					<div className="bg-white rounded-lg shadow-lg p-6">
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

							<div>
								<h2 className="text-xl font-semibold mb-3">
									Espaciado
								</h2>
								<div>
									<label className="block text-sm font-medium mb-1">
										Separación (m)
									</label>
									<input
										type="number"
										step="0.01"
										value={spacing}
										onChange={(e) =>
											setSpacing(e.target.value)
										}
										className="w-full px-3 py-2 border rounded"
									/>
								</div>
							</div>

							<button
								onClick={calculatePanels}
								className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
							>
								Calcular
							</button>
						</div>
					</div>

					{/* Panel de resultados */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						{panels.length > 0 ? (
							<div className="space-y-4">
								<div>
									<h2 className="text-xl font-semibold mb-3">
										Resultados
									</h2>
									<div className="space-y-2 text-sm">
										<p>
											<span className="font-medium">
												Horizontal:
											</span>{" "}
											{horizontalCount} paneles
										</p>
										<p>
											<span className="font-medium">
												Vertical:
											</span>{" "}
											{verticalCount} paneles
										</p>
										<div className="bg-orange-100 p-2 rounded">
											<p>
												<span className="font-medium">
													Mixta:
												</span>{" "}
												{mixedCount} paneles
											</p>
											<p className="text-xs text-gray-600">
												{mixedDetails.horizontal}{" "}
												Horizontales |{" "}
												{mixedDetails.vertical}{" "}
												Verticales
											</p>
										</div>
										<p className="text-lg font-bold text-green-700 pt-2">
											Mejor: {bestOption()}
										</p>
									</div>
								</div>

								<div>
									<h2 className="text-xl font-semibold mb-3">
										Visualización
									</h2>

									{/* Selector de orientación */}
									<div className="mb-4 flex gap-2">
										<button
											onClick={() => {
												setSelectedView("horizontal");
												setPanels(horizontalPanels);
											}}
											className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors relative ${
												selectedView === "horizontal"
													? "bg-blue-600 text-white"
													: "bg-gray-200 text-gray-700 hover:bg-gray-300"
											}`}
										>
											Horizontal ({horizontalCount})
											{isBestOption("horizontal") && (
												<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
													Mejor
												</span>
											)}
										</button>
										<button
											onClick={() => {
												setSelectedView("vertical");
												setPanels(verticalPanels);
											}}
											className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors relative ${
												selectedView === "vertical"
													? "bg-purple-600 text-white"
													: "bg-gray-200 text-gray-700 hover:bg-gray-300"
											}`}
										>
											Vertical ({verticalCount})
											{isBestOption("vertical") && (
												<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
													Mejor
												</span>
											)}
										</button>
										<button
											onClick={() => {
												setSelectedView("mixed");
												setPanels(mixedPanels);
											}}
											className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors relative ${
												selectedView === "mixed"
													? "bg-orange-600 text-white"
													: "bg-gray-200 text-gray-700 hover:bg-gray-300"
											}`}
										>
											Mixta ({mixedCount})
											{isBestOption("mixed") && (
												<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
													Mejor
												</span>
											)}
										</button>
									</div>

									<RoofVisualization
										roofWidth={parseFloat(roofWidth)}
										roofHeight={parseFloat(roofHeight)}
										panels={panels}
										spacing={parseFloat(spacing)}
									/>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-center h-full text-gray-400">
								<p>
									Ingresa las dimensiones y presiona calcular
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

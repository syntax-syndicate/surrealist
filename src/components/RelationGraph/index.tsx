import {
	iconMagnifyPlus,
	iconMagnifyMinus,
	iconFullscreen,
	iconImage,
	iconAPI,
} from "~/util/icons";

import { Box, BoxProps, ElementProps, Paper, Stack, useMantineTheme } from "@mantine/core";
import { createNodeBorderProgram } from "@sigma/node-border";
import Graph from "graphology";
import { useContextMenu } from "mantine-contextmenu";
import { useRef, useEffect } from "react";
import Sigma from "sigma";
import { createEdgeArrowProgram } from "sigma/rendering";
import { useStable } from "~/hooks/stable";
import { useIsLight } from "~/hooks/theme";
import { ActionButton } from "../ActionButton";
import { Icon } from "../Icon";

export interface RelationGraphProps extends BoxProps, ElementProps<"div"> {
	graph: Graph;
	onClickNode?: (node: string) => void;
}

export function RelationGraph({ graph, onClickNode, ...other }: RelationGraphProps) {
	const ref = useRef<HTMLDivElement>(null);
	const sigma = useRef<Sigma | null>(null);
	const theme = useMantineTheme();
	const isLight = useIsLight();

	const { showContextMenu } = useContextMenu();

	const edgeColor = isLight ? theme.colors.slate[3] : theme.colors.slate[5];
	const nodeLabelColor = isLight ? theme.colors.slate[9] : theme.colors.slate[0];
	const edgeLabelColor = isLight ? theme.colors.slate[5] : theme.colors.slate[2];

	const handleZoomIn = useStable(() => {
		sigma.current?.refresh();
		sigma.current?.getCamera().animatedZoom();
	});

	const handleZoomOut = useStable(() => {
		sigma.current?.refresh();
		sigma.current?.getCamera().animatedUnzoom();
	});

	const handleResetZoom = useStable(() => {
		sigma.current?.refresh();
		sigma.current?.getCamera().animatedReset();
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: Initial render
	useEffect(() => {
		if (!ref.current) return;

		const instance = new Sigma(graph, ref.current, {
			defaultEdgeColor: edgeColor,
			allowInvalidContainer: true,
			renderEdgeLabels: true,
			labelFont: "JetBrains Mono",
			labelColor: { color: nodeLabelColor },
			labelSize: 10,
			edgeLabelFont: "JetBrains Mono",
			edgeLabelColor: { color: edgeLabelColor },
			edgeLabelSize: 10,
			stagePadding: 50,
			edgeProgramClasses: {
				arrow: createEdgeArrowProgram({
					widenessToThicknessRatio: 4,
					lengthToThicknessRatio: 4,
				}),
			},
			nodeProgramClasses: {
				border: createNodeBorderProgram({
					borders: [
						{ color: { value: theme.colors.slate[5] }, size: { value: 0.1 } },
						{ color: { value: theme.colors.slate[0] }, size: { value: 0.1 } },
						{ color: { attribute: "color" }, size: { value: 1.0 } },
					],
				}),
			},
			defaultNodeType: "border",
		});

		sigma.current = instance;

		instance.on("clickNode", ({ node }) => {
			onClickNode?.(node);

			const nodeDisplayData = instance.getNodeDisplayData(node);

			if (nodeDisplayData) {
				instance.getCamera().animate({ ...nodeDisplayData, ratio: 0.35 });
			}
		});

		return () => {
			instance.kill();
			sigma.current = null;
		};
	}, []);

	useEffect(() => {
		if (sigma.current) {
			sigma.current.clear();
			sigma.current.setGraph(graph);
			sigma.current.refresh();
		}
	}, [graph]);

	useEffect(() => {
		if (sigma.current) {
			sigma.current.setSetting("defaultEdgeColor", edgeColor);
			sigma.current.setSetting("labelColor", { color: nodeLabelColor });
			sigma.current.setSetting("edgeLabelColor", { color: edgeLabelColor });
		}
	}, [edgeColor, nodeLabelColor, edgeLabelColor]);

	return (
		<Box
			pos="relative"
			{...other}
		>
			<Paper
				bg={isLight ? undefined : "slate.9"}
				withBorder={isLight}
				h="100%"
				ref={ref}
				onContextMenu={showContextMenu([
					{
						key: "zoom-in",
						icon: <Icon path={iconMagnifyPlus} />,
						title: "Zoom in",
						onClick: handleZoomIn,
					},
					{
						key: "zoom-out",
						icon: <Icon path={iconMagnifyMinus} />,
						title: "Zoom out",
						onClick: handleZoomOut,
					},
					{
						key: "view",
						icon: <Icon path={iconFullscreen} />,
						title: "Fit viewport",
						onClick: handleResetZoom,
					},
					{ key: "divider" },
					{
						key: "download-png",
						icon: <Icon path={iconImage} />,
						title: "Export as PNG",
						disabled: true,
						onClick: () => {},
					},
					{
						key: "download-svg",
						icon: <Icon path={iconAPI} />,
						title: "Export as SVG",
						disabled: true,
						onClick: () => {},
					},
				])}
			/>
			<Paper
				withBorder
				pos="absolute"
				right={12}
				bottom={12}
				shadow="sm"
				p="xs"
			>
				<Stack>
					<ActionButton
						label="Zoom in"
						onClick={handleZoomIn}
					>
						<Icon path={iconMagnifyPlus} />
					</ActionButton>
					<ActionButton
						label="Zoom out"
						onClick={handleZoomOut}
					>
						<Icon path={iconMagnifyMinus} />
					</ActionButton>
					<ActionButton
						label="Fit viewport"
						onClick={handleResetZoom}
					>
						<Icon path={iconFullscreen} />
					</ActionButton>
				</Stack>
			</Paper>
		</Box>
	);
}

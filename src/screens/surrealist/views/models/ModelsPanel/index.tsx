import { Badge, Group, ScrollArea, Stack, TextInput } from "@mantine/core";
import { Text } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { ActionButton } from "~/components/ActionButton";
import { Entry } from "~/components/Entry";
import { Icon } from "~/components/Icon";
import { ContentPane } from "~/components/Pane";
import { useIsConnected } from "~/hooks/connection";
import { useIsLight } from "~/hooks/theme";
import type { SchemaModel } from "~/types";
import { iconDownload, iconModuleML, iconSearch, iconUpload } from "~/util/icons";
import classes from "./style.module.scss";

export interface ModelsPanelProps {
	active: string;
	models: SchemaModel[];
	onSelect: (id: string) => void;
	onDownload: (model: SchemaModel) => void;
	onUpload: () => void;
}

export function ModelsPanel({ active, models, onSelect, onDownload, onUpload }: ModelsPanelProps) {
	const isLight = useIsLight();
	const isConnected = useIsConnected();
	const { showContextMenu } = useContextMenu();

	const [search, setSearch] = useInputState("");

	return (
		<ContentPane
			title="Models"
			icon={iconModuleML}
			w={275}
			style={{ flexShrink: 0 }}
			infoSection={
				models.length > 0 && (
					<Badge
						color={isLight ? "slate.0" : "slate.9"}
						radius="sm"
						c="inherit"
					>
						{models.length}
					</Badge>
				)
			}
			rightSection={
				<Group>
					<ActionButton
						disabled={!isConnected}
						label="Upload SurrealML model"
						onClick={onUpload}
					>
						<Icon path={iconUpload} />
					</ActionButton>
				</Group>
			}
		>
			<ScrollArea
				pos="absolute"
				top={0}
				left={12}
				right={12}
				bottom={12}
				classNames={{
					viewport: classes.scroller,
				}}
			>
				<Stack
					gap="xs"
					pb="md"
				>
					{models.length > 0 ? (
						<TextInput
							placeholder="Search models..."
							leftSection={<Icon path={iconSearch} />}
							value={search}
							spellCheck={false}
							onChange={setSearch}
							variant="unstyled"
							autoFocus
						/>
					) : (
						<Text
							c="slate"
							ta="center"
							mt="lg"
						>
							No models found
						</Text>
					)}

					{models.map((m, i) => (
						<Entry
							key={i}
							// isActive={m.name === active}
							// onClick={() => onSelect(m.name)}
							leftSection={<Icon path={iconModuleML} />}
							onContextMenu={showContextMenu([
								{
									key: "download",
									title: "Download model",
									icon: <Icon path={iconDownload} />,
									onClick: () => onDownload(m),
								},
							])}
						>
							<Stack
								gap={0}
								align="start"
							>
								<Text
									style={{
										textOverflow: "ellipsis",
										overflow: "hidden",
									}}
								>
									{m.name}
								</Text>
								<Text
									opacity={0.6}
									size="sm"
								>
									{m.version}
								</Text>
							</Stack>
						</Entry>
					))}
				</Stack>
			</ScrollArea>
		</ContentPane>
	);
}

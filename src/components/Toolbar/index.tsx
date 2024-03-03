import classes from "./style.module.scss";
import surrealistLogo from "~/assets/images/logo.png";
import { Group, Button, Modal, TextInput, Image, Center, ActionIcon, Tooltip } from "@mantine/core";
import { useState } from "react";
import { useStable } from "~/hooks/stable";
import { updateTitle } from "~/util/helpers";
import { Form } from "../Form";
import { Icon } from "../Icon";
import { LocalDatabase } from "./LocalDatabase";
import { Spacer } from "../Spacer";
import { adapter } from "~/adapter";
import { useConnection } from "~/hooks/connection";
import { useConfigStore } from "~/stores/config";
import { closeConnection, openConnection } from "~/database";
import { useDatabaseStore } from "~/stores/database";
import { Connections } from "./connections";
import { showNotification } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { ConsoleDrawer } from "./ConsoleDrawer";
import { iconReset } from "~/util/icons";
import { HelpAndSupport } from "./HelpAndSupport";

export function Toolbar() {
	const { updateConnection } = useConfigStore.getState();

	const isConnected = useDatabaseStore((s) => s.isConnected);

	const connection = useConnection();

	const [showConsole, setShowConsole] = useDisclosure();
	const [editingTab, setEditingTab] = useState<string | null>(null);
	const [tabName, setTabName] = useState("");

	const closeEditingTab = useStable(() => {
		setEditingTab(null);
	});

	const saveTabName = useStable(() => {
		updateConnection({
			id: editingTab!,
			name: tabName,
		});

		updateTitle();
		closeEditingTab();
	});

	const resetSandbox = useStable(() => {
		closeConnection();
		openConnection();

		showNotification({
			message: "Sandbox environment reset",
		});
	});

	const isSandbox = connection?.id === "sandbox";

	return (
		<>
			<Group
				p="xs"
				gap="sm"
				pos="relative"
				align="center"
				wrap="nowrap"
				className={classes.root}
				h={64}
			>
				<Center w={52}>
					<Image
						style={{ pointerEvents: "none", userSelect: "none" }}
						src={surrealistLogo}
						height={26}
					/>
				</Center>

				<Connections />

				{isConnected && isSandbox && (
					<Tooltip label="Reset sandbox environment">
						<ActionIcon
							color="slate"
							variant="subtle"
							onClick={resetSandbox}
						>
							<Icon path={iconReset} />
						</ActionIcon>
					</Tooltip>
				)}

				<Spacer />

				{connection && adapter.isServeSupported && (
					<LocalDatabase
						toggleConsole={setShowConsole.toggle}
					/>
				)}

				<HelpAndSupport />

				<Modal
					opened={!!editingTab}
					onClose={closeEditingTab}
				>
					<Form onSubmit={saveTabName}>
						<Group>
							<TextInput
								style={{ flex: 1 }}
								placeholder="Enter tab name"
								value={tabName}
								onChange={(e) => setTabName(e.target.value)}
								autoFocus
								onFocus={(e) => e.target.select()}
							/>
							<Button type="submit">Rename</Button>
						</Group>
					</Form>
				</Modal>

				<ConsoleDrawer
					opened={showConsole}
					onClose={setShowConsole.close}
				/>
			</Group>
		</>
	);
}

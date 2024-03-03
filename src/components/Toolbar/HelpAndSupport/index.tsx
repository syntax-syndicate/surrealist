import classes from "./style.module.scss";
import { Text, Title, Tooltip, UnstyledButton } from "@mantine/core";
import { ActionIcon, Modal, SimpleGrid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { mdiBook, mdiBug, mdiChat, mdiRoutes } from "@mdi/js";
import { adapter } from "~/adapter";
import { Icon } from "~/components/Icon";
import { useIsLight } from "~/hooks/theme";
import { iconClose, iconHelp } from "~/util/icons";

const TILES = [
	{
		title: "Documentation",
		description: "Need help? Check out our documentation for help.",
		icon: mdiBook,
		onClick: () => adapter.openUrl("https://docs.surrealdb.com/docs/tools/surrealist")
	},
	{
		title: "Report an issue",
		description: "Something isn't working right? Let us know and we'll fix it.",
		icon: mdiBug,
		onClick: () => adapter.openUrl("https://github.com/surrealdb/surrealist/issues")
	},
	{
		title: "Feedback",
		description: "Have a suggestion or feedback? We'd love to hear it.",
		icon: mdiChat,
		onClick: () => {}
	},
	{
		title: "Restart the tour",
		description: "Need to restart the tour? Click here to start over.",
		icon: mdiRoutes,
		onClick: () => {}
	}
];

export function HelpAndSupport() {
	const [isOpen, openHandle] = useDisclosure();
	const isLight = useIsLight();

	return (
		<>
			<Tooltip label="Help and support">
				<ActionIcon
					w={36}
					h={36}
					onClick={openHandle.toggle}
				>
					<Icon path={iconHelp} size="lg" />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={isOpen}
				onClose={openHandle.close}
				ta="center"
				size="sm"
			>
				<Title fz={20} c="bright">
					How can we help you?
				</Title>

				<ActionIcon
					pos="absolute"
					top={20}
					right={20}
					onClick={openHandle.close}
				>
					<Icon path={iconClose} />
				</ActionIcon>

				<SimpleGrid cols={2} mt="xl">
					{TILES.map((tile, i) => (
						<UnstyledButton
							key={i}
							bg={isLight ? "slate.0" : "slate.9"}
							className={classes.tile}
							onClick={tile.onClick}
							p="md"
						>
							<Icon
								path={tile.icon}
								c="bright"
								size="xl"
								mb="sm"
							/>
							<Text
								c="bright"
								fw={600}
								fz="lg"
								mb={4}
							>
								{tile.title}
							</Text>
							<Text fz="sm">
								{tile.description}
							</Text>
						</UnstyledButton>
					))}
				</SimpleGrid>
			</Modal>
		</>
	);
}
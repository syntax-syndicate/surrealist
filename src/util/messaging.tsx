import { RESULT_MODES } from "~/constants";
import { executeQuery, executeUserQuery } from "~/screens/surrealist/connection/connection";
import { useConfigStore } from "~/stores/config";
import { useDatabaseStore } from "~/stores/database";
import type { ResultMode } from "~/types";
import { getActiveConnection, getActiveQuery } from "./connection";
import { SetQueryEvent } from "./global-events";

/**
 * Handle incoming window messages
 */
export function handleWindowMessage(event: MessageEvent) {
	const data = event.data as any;

	if (typeof data !== "object" || !data.action) {
		return;
	}

	const options = typeof data.options === "object" ? data.options : {};
	const connection = getActiveConnection();
	const active = getActiveQuery();

	if (!active || !connection) {
		return;
	}

	const { updateQueryTab } = useConfigStore.getState();
	const { clearQueryResponse } = useDatabaseStore.getState();

	switch (data.action) {
		case "set_editor": {
			const { query, variables } = options;

			if (query) {
				SetQueryEvent.dispatch(query);
			}

			if (variables) {
				updateQueryTab(connection, {
					id: active.id,
					variables: active.variables,
				});
			}

			break;
		}
		case "clear_response": {
			clearQueryResponse(active.id);
			break;
		}
		case "set_editor_mode": {
			const { mode } = options;

			if (typeof mode !== "string") {
				return;
			}

			updateQueryTab(connection, {
				id: active.id,
				showVariables: mode === "variables",
			});
			break;
		}
		case "set_result_mode": {
			const { mode } = options;
			const available = RESULT_MODES.map((mode) => mode.value);

			if (typeof mode !== "string" || !available.includes(mode as any)) {
				return;
			}

			updateQueryTab(connection, {
				id: active.id,
				resultMode: mode as ResultMode,
			});
			break;
		}
		case "run_query": {
			executeUserQuery();
			break;
		}
		case "execute_query": {
			const { query } = options;

			if (typeof query !== "string") {
				return;
			}

			executeQuery(query);
			break;
		}
	}
}

/**
 * Broadcast a message to the parent window
 *
 * @param action The action to broadcast
 * @param options The options to send
 */
export function broadcastMessage(action: string, options: any = {}) {
	parent.postMessage({ action, options }, "*");
}

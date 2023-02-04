import { ColorScheme } from "@mantine/core";
import {SurrealConnection} from "./surreal";

export type AuthMode = 'root' | 'namespace' | 'database' | 'scope';
export type DriverType = "file" | "memory" | "tikv";
export type QueryListing = "history" | "favorites";
export type ResultListing = "table" | "json";
export type ViewMode = 'query' | 'explorer';
export type SourceMode = 'schema' | 'infer';

export type OpenFn = (id: string | null) => void;
export type ColumnSort = [string, 'asc' | 'desc'];

export interface SurrealistConfig {
	theme: ColorScheme | 'automatic';
	tabs: SurrealistTab[];
	autoConnect: boolean;
	tableSuggest: boolean;
	wordWrap: boolean;
	queryHistory: HistoryEntry[];
	queryFavorites: FavoritesEntry[];
	localDriver: DriverType;
	localStorage: string;
	enableConsole: boolean;
	enableListing: boolean;
	queryTimeout: number;
	updateChecker: boolean;
	queryListing: QueryListing;
	resultListing: ResultListing;
	zoomLevel: number;
}

export interface SurrealistTab {
	id: string;
	name: string;
	query: string;
	variables: string;
	connection: SurrealConnection;
	lastResponse: any;
	layout: any;
}

export interface HistoryEntry {
	id: string;
	query: string;
	timestamp: number;
	tabName: string;
}

export interface FavoritesEntry {
	id: string;
	query: string;
	name: string;
}

export interface ConsoleOutputMessage {
	kind: "stdout" | "stderr";
	message: string;
}
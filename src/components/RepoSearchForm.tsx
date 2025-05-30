import { Button } from "@radix-ui/themes";
import { useState } from "react";

export function RepoSearchForm({
	onSearch,
}: { onSearch: (repo: string) => void }) {
	console.log("RepoSearchForm");

	const [input, setInput] = useState("");

	function searchSubmit(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		if (input.trim()) onSearch(input.trim());
	}

	return (
		<form className="flex gap-2 mb-4" onSubmit={(e) => searchSubmit(e)}>
			<input
				className="border px-2 py-1 rounded w-64"
				placeholder="e.g. looskie/cside-interview"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<Button type="submit" variant="surface">
				Search
			</Button>
		</form>
	);
}

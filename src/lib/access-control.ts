/**
 * Optional GitHub login allowlist (comma-separated, case-insensitive).
 * When unset or empty after parsing, all GitHub users may sign in.
 */
export function parseGithubLoginAllowlist(raw: string | undefined): string[] | null {
	if (raw === undefined || raw === null) {
		return null;
	}
	const entries = raw
		.split(",")
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean);
	if (entries.length === 0) {
		return null;
	}
	return entries;
}

export function isGithubLoginAllowed(login: string, allowlist: string[] | null): boolean {
	if (allowlist === null) {
		return true;
	}
	return allowlist.includes(login.trim().toLowerCase());
}

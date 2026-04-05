import { describe, it, expect } from "vitest";
import { parseGithubLoginAllowlist, isGithubLoginAllowed } from "../../src/lib/access-control.js";

describe("access-control", () => {
	describe("parseGithubLoginAllowlist", () => {
		it("returns null for undefined", () => {
			expect(parseGithubLoginAllowlist(undefined)).toBeNull();
		});

		it("returns null for empty string", () => {
			expect(parseGithubLoginAllowlist("")).toBeNull();
		});

		it("returns null for whitespace-only", () => {
			expect(parseGithubLoginAllowlist("  ,  , ")).toBeNull();
		});

		it("parses comma-separated logins lowercase", () => {
			expect(parseGithubLoginAllowlist("Alice, BOB")).toEqual(["alice", "bob"]);
		});
	});

	describe("isGithubLoginAllowed", () => {
		it("allows any login when allowlist is null", () => {
			expect(isGithubLoginAllowed("anyone", null)).toBe(true);
		});

		it("matches case-insensitively", () => {
			const list = parseGithubLoginAllowlist("alice");
			expect(isGithubLoginAllowed("Alice", list)).toBe(true);
		});

		it("rejects when not in list", () => {
			const list = parseGithubLoginAllowlist("alice");
			expect(isGithubLoginAllowed("bob", list)).toBe(false);
		});
	});
});

import { describe, expect, it } from "vitest";
import { selectCurriculum } from "../src/curriculum-tools.js";
import { validateMcpClaims } from "../src/mcp-claims.js";
import { rankCurriculum } from "../src/lib/curriculum.js";

describe("selectCurriculum", () => {
  it("prefers a locked non-contradiction rule that matches the request", () => {
    const rows = [
      { id: "1", kind: "PROMISE", title: "Office hours", status: "DEVELOPING", content: "Weekly calls", tags: [] },
      { id: "2", kind: "NONCONTRADICTION", title: "No homework after module three", status: "LOCKED", content: "Learners do not receive new homework after module three.", tags: ["homework"] },
      { id: "3", kind: "MODULE_OUTCOME", title: "Retired outcome", status: "RETIRED", content: "homework", tags: [] }
    ];
    const selected = selectCurriculum("homework after module three", rows, 2);
    expect(selected.map((row) => row.title)).toEqual(["No homework after module three", "Office hours"]);
  });
});

describe("rankCurriculum", () => {
  it("drops retired facts", () => {
    const ranked = rankCurriculum("promise", [
      { id: "1", kind: "PROMISE", title: "Keep the promise", status: "RETIRED", content: "old", tags: [] }
    ]);
    expect(ranked).toEqual([]);
  });
});

describe("validateMcpClaims", () => {
  it("accepts an email-scoped token for this resource", () => {
    const claims = {
      sub: "user-1",
      iss: "https://example.supabase.co/auth/v1",
      aud: "https://cohort.example/mcp",
      role: "authenticated",
      exp: 2_000_000_000,
      client_id: "client",
      session_id: "session",
      scope: "email offline_access"
    };
    const token = `aaa.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.sig`;
    expect(validateMcpClaims(token, "user-1", claims.iss, "https://cohort.example/mcp", 1_700_000_000).sub).toBe("user-1");
  });

  it("rejects a token that is missing the email scope", () => {
    const claims = {
      sub: "user-1",
      iss: "https://example.supabase.co/auth/v1",
      aud: "https://cohort.example/mcp",
      role: "authenticated",
      exp: 2_000_000_000,
      client_id: "client",
      session_id: "session",
      scope: "openid"
    };
    const token = `aaa.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.sig`;
    expect(() => validateMcpClaims(token, "user-1", claims.iss, "https://cohort.example/mcp", 1_700_000_000)).toThrow(/Reconnect Cohort/);
  });
});

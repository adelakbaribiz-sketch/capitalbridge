import { describe, expect, it } from "vitest";
import { encodeList, decodeList } from "@/lib/json-list";

describe("json-list", () => {
  it("round-trips a list of strings", () => {
    const values = ["Fintech & Financial Infrastructure", "AI & ML"];
    expect(decodeList(encodeList(values))).toEqual(values);
  });

  it("round-trips an empty list", () => {
    expect(decodeList(encodeList([]))).toEqual([]);
  });

  it("returns an empty array for malformed JSON instead of throwing", () => {
    expect(decodeList("not json")).toEqual([]);
  });

  it("returns an empty array for valid JSON that isn't a string array", () => {
    expect(decodeList(JSON.stringify({ not: "an array" }))).toEqual([]);
    expect(decodeList(JSON.stringify([1, 2, 3]))).toEqual([]);
  });

  it("filters out non-string entries from a mixed array", () => {
    expect(decodeList(JSON.stringify(["a", 1, "b", null]))).toEqual(["a", "b"]);
  });
});

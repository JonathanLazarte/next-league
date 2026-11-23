import {
  circularDirection,
  getCircularWindow,
  stepIndex,
} from "./circularWindow";

describe("getCircularWindow", () => {
  it("shows only the skins that exist", () => {
    expect(getCircularWindow(0, 2, 5)).toEqual([0, 1]);
    expect(getCircularWindow(1, 2, 5)).toEqual([1, 0]);
    expect(getCircularWindow(0, 1, 5)).toEqual([0]);
    expect(getCircularWindow(0, 0, 5)).toEqual([]);
  });

  it("does not repeat an item to fill the track", () => {
    for (let selected = 0; selected < 4; selected += 1) {
      const window = getCircularWindow(selected, 4, 5);
      expect(window).toHaveLength(4);
      expect(new Set(window).size).toBe(4);
    }
  });

  it("centers the first skin between the last ones", () => {
    expect(getCircularWindow(0, 5, 5)).toEqual([3, 4, 0, 1, 2]);
    expect(getCircularWindow(1, 5, 5)).toEqual([4, 0, 1, 2, 3]);
  });

  it("keeps the next skin on the same side when the selection wraps", () => {
    expect(getCircularWindow(0, 6, 5)).toEqual([4, 5, 0, 1, 2]);
    expect(getCircularWindow(5, 6, 5)).toEqual([3, 4, 5, 0, 1]);
    expect(getCircularWindow(4, 5, 3)).toEqual([3, 4, 0]);
    expect(getCircularWindow(0, 5, 3)).toEqual([4, 0, 1]);
  });
});

describe("stepIndex", () => {
  it("wraps forward from the last item to the first", () => {
    expect(stepIndex(4, 5, 1)).toBe(0);
    expect(stepIndex(1, 2, 1)).toBe(0);
  });

  it("wraps backward from the first item to the last", () => {
    expect(stepIndex(0, 5, -1)).toBe(4);
    expect(stepIndex(0, 2, -1)).toBe(1);
  });
});

describe("circularDirection", () => {
  it("keeps moving forward when the shortest wrap is the next step", () => {
    expect(circularDirection(4, 0, 5)).toBe(1);
    expect(circularDirection(0, 4, 5)).toBe(-1);
    expect(circularDirection(1, 0, 2)).toBe(1);
  });
});

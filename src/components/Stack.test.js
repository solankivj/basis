import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Stack, Text } from ".";
import { render } from "../utils/test";

describe("Stack", () => {
  it("with testId", () => {
    const { container } = render(
      <Stack testId="my-stack">
        <Text>Hello</Text>
        <Text>World</Text>
      </Stack>
    );

    expect(container.firstChild).toHaveAttribute("data-testid", "my-stack");
  });
});

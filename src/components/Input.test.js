import React from "react";
import { render, screen, waitFor } from "../utils/test";
import "@testing-library/jest-dom/extend-expect";
import Form from "./Form";
import Input from "./Input";
import Container from "./Container";

function FormWithInput(props) {
  const initialValues = {
    name: "",
  };

  return (
    <Form initialValues={initialValues}>
      <Input name="name" {...props} />
    </Form>
  );
}

describe("Input", () => {
  it("renders label that is connected to the input", () => {
    render(<FormWithInput label="First name" />);

    const label = screen.getByText("First name");
    const input = screen.getByLabelText("First name");
    const inputContainer = input.parentElement;

    expect(label.tagName).toBe("LABEL");
    expect(input.tagName).toBe("INPUT");

    const inputId = input.getAttribute("id");

    expect(inputId).toBeTruthy();
    expect(input).toHaveAttribute("type", "text");
    expect(label).toHaveAttribute("for", inputId);

    expect(label).toHaveStyle({
      display: "flex",
      fontFamily: "'Roboto',sans-serif",
      fontSize: "16px",
      fontWeight: "500",
      lineHeight: "24px",
      color: "#414141",
      marginBottom: "8px",
    });

    expect(inputContainer).toHaveStyle({
      fontSize: "16px",
      fontWeight: "300",
      lineHeight: "24px",
      fontFamily: "'Roboto',sans-serif",
      color: "#000000",
    });

    expect(input).toHaveStyle({
      boxSizing: "border-box",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      fontFamily: "inherit",
      color: "inherit",
      padding: "0px 16px 0px 16px",
      width: "100%",
      height: "48px",
      border: "0",
      margin: "0",
      backgroundColor: "#f2f2f2",
    });
  });

  it("numeric variant", () => {
    render(<FormWithInput label="New credit limit" variant="numeric" />);

    const input = screen.getByLabelText("New credit limit");

    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("pattern", "[0-9]*");
  });

  it("with numericPrefix", () => {
    render(
      <FormWithInput
        label="New credit limit"
        variant="numeric"
        numericPrefix="$"
      />
    );

    const input = screen.getByLabelText("New credit limit");

    expect(input).toHaveStyle({
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: "calc(16px + 2ch)",
      paddingRight: "16px",
    });
  });

  it("with numericSuffix", () => {
    render(
      <FormWithInput
        label="New credit limit"
        variant="numeric"
        numericSuffix="mysuffix"
      />
    );

    const input = screen.getByLabelText("New credit limit");

    expect(input).toHaveStyle({
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: "16px",
      paddingRight: "calc(16px + 9ch)",
    });
  });

  it("renders help text that is connected to the input", () => {
    const { container } = render(
      <FormWithInput label="First name" helpText="Some help text" />
    );
    const input = screen.getByLabelText("First name");
    const describedBy = input.getAttribute("aria-describedby");
    const errorMessage = container.querySelector(`[id="${describedBy}"]`);

    expect(errorMessage).toHaveTextContent("Some help text");
  });

  it("renders error message", async () => {
    render(<FormWithInput label="First name" helpText="Some help text" />);

    const input = screen.getByLabelText("First name");

    input.focus();
    input.blur();

    await screen.findByText("Required");
    await waitFor(() => {
      expect(screen.queryByText("Some help text")).not.toBeInTheDocument();
    });
  });

  it("inside dark container", () => {
    render(
      <Container bg="primary.blue.t100">
        <FormWithInput label="First name" />
      </Container>
    );

    const input = screen.getByLabelText("First name");

    expect(input).toHaveStyle({
      backgroundColor: "#ffffff",
    });
  });

  it("inside nested container", () => {
    render(
      <Container bg="primary.blue.t100">
        <Container>
          <FormWithInput label="First name" />
        </Container>
      </Container>
    );

    const input = screen.getByLabelText("First name");

    expect(input).toHaveStyle({
      backgroundColor: "#ffffff",
    });
  });

  it("with testId", () => {
    const { container } = render(
      <FormWithInput label="First name" testId="my-input" />
    );

    expect(container.querySelector("form").firstChild).toHaveAttribute(
      "data-testid",
      "my-input"
    );
  });
});

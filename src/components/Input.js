import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import useField from "../hooks/internal/useField";
import { mergeProps } from "../utils/component";
import Field from "./internal/Field";
import InternalInput from "./internal/InternalInput";

const { VARIANTS, COLORS, NUMERIC_REGEX } = InternalInput;

const DEFAULT_PROPS = {
  variant: InternalInput.DEFAULT_PROPS.variant,
  color: InternalInput.DEFAULT_PROPS.color,
  disabled: false,
  pasteAllowed: true,
  optional: false,
  validate: (value, { isEmpty, variant }) => {
    if (isEmpty(value)) {
      return "Required";
    }

    if (variant === "numeric" && NUMERIC_REGEX.test(value) === false) {
      return "Only 0-9 are allowed";
    }

    return null;
  },
};

Input.VARIANTS = VARIANTS;
Input.COLORS = COLORS;
Input.DEFAULT_PROPS = DEFAULT_PROPS;

function Input(props) {
  const mergedProps = mergeProps(
    props,
    DEFAULT_PROPS,
    {},
    {
      variant: (variant) => VARIANTS.includes(variant),
      numericPrefix: (numericPrefix) =>
        typeof numericPrefix === "string" && numericPrefix.length > 0,
      numericSuffix: (numericSuffix) =>
        typeof numericSuffix === "string" && numericSuffix.length > 0,
      color: (color) => COLORS.includes(color),
      disabled: (disabled) => typeof disabled === "boolean",
      pasteAllowed: (pasteAllowed) => typeof pasteAllowed === "boolean",
      optional: (optional) => typeof optional === "boolean",
    }
  );
  const {
    name,
    variant,
    numericPrefix,
    numericSuffix,
    label,
    placeholder,
    helpText,
    disabled,
    pasteAllowed,
    optional,
    validate,
    validateData,
    testId,
    __internal__focus,
  } = mergedProps;
  const [inputId] = useState(() => `input-${nanoid()}`);
  const [auxId] = useState(() => `input-aux-${nanoid()}`);
  const isEmpty = useCallback((value) => value.trim() === "", []);
  const data = useMemo(
    () => ({
      isEmpty,
      variant,
      ...(validateData && { data: validateData }),
    }),
    [isEmpty, variant, validateData]
  );
  const { value, errors, hasErrors, onFocus, onBlur, onChange } = useField(
    "Input",
    {
      name,
      disabled,
      optional,
      validate,
      data,
    }
  );

  return (
    <Field
      optional={optional}
      disabled={disabled}
      label={label}
      labelFor={inputId}
      auxId={auxId}
      helpText={helpText}
      errors={errors}
      testId={testId}
    >
      <InternalInput
        id={label ? inputId : null}
        name={name}
        variant={variant}
        numericPrefix={numericPrefix}
        numericSuffix={numericSuffix}
        placeholder={placeholder}
        color={props.color}
        disabled={disabled}
        pasteAllowed={pasteAllowed}
        isValid={!hasErrors}
        describedBy={helpText || hasErrors ? auxId : null}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        __internal__focus={__internal__focus}
      />
    </Field>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(VARIANTS),
  numericPrefix: PropTypes.string,
  numericSuffix: PropTypes.string,
  color: PropTypes.oneOf(COLORS),
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  helpText: PropTypes.node,
  disabled: PropTypes.bool,
  pasteAllowed: PropTypes.bool,
  optional: PropTypes.bool,
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  validateData: PropTypes.any,
  testId: PropTypes.string,
  __internal__focus: PropTypes.bool,
};

export default Input;

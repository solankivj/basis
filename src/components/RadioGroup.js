import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import useField from "../hooks/internal/useField";
import { mergeProps, areOptionsValid } from "../utils/component";
import Field from "./internal/Field";
import InternalRadioGroup from "./internal/InternalRadioGroup";

const { COLORS } = InternalRadioGroup;

function isOptionSelected(options, value) {
  return options.findIndex((option) => option.value === value) > -1;
}

const DEFAULT_PROPS = {
  color: InternalRadioGroup.DEFAULT_PROPS.color,
  showCircles: true,
  disabled: false,
  optional: false,
  validate: (value, { isEmpty }) => {
    if (isEmpty(value)) {
      return "Please make a selection.";
    }

    return null;
  },
};

RadioGroup.COLORS = COLORS;
RadioGroup.DEFAULT_PROPS = DEFAULT_PROPS;

function RadioGroup(props) {
  const mergedProps = mergeProps(
    props,
    DEFAULT_PROPS,
    {},
    {
      color: (color) => COLORS.includes(color),
      showCircles: (showCircles) => typeof showCircles === "boolean",
      disabled: (disabled) => typeof disabled === "boolean",
      optional: (optional) => typeof optional === "boolean",
      options: (options) => areOptionsValid(options),
    }
  );
  const {
    name,
    label,
    options,
    columns,
    showCircles,
    helpText,
    disabled,
    optional,
    validate,
    validateData,
    testId,
  } = mergedProps;

  if (!options) {
    throw new Error(
      `RadioGroup options should have the following format: [{ label: "option-label", value: "option-value" }, ...]`
    );
  }

  const [labelId] = useState(() => `radio-group-label-${nanoid()}`);
  const [auxId] = useState(() => `radio-group-aux-${nanoid()}`);
  const cols = columns === undefined ? options.length : columns;
  const isEmpty = useCallback(
    (value) => isOptionSelected(options, value) === false,
    [options]
  );
  const data = useMemo(
    () => ({
      isEmpty,
      ...(validateData && { data: validateData }),
    }),
    [isEmpty, validateData]
  );
  const {
    value,
    errors,
    hasErrors,
    onFocus,
    onBlur,
    onChange,
    onMouseDown,
  } = useField("RadioGroup", {
    name,
    disabled,
    optional,
    validate,
    data,
  });

  return (
    <Field
      optional={optional}
      disabled={disabled}
      label={label}
      labelId={labelId}
      auxId={auxId}
      helpText={helpText}
      errors={errors}
      testId={testId}
    >
      <InternalRadioGroup
        name={name}
        labelId={labelId}
        auxId={auxId}
        options={options}
        columns={cols}
        color={props.color}
        showCircles={showCircles}
        disabled={disabled}
        isValid={!hasErrors}
        describedBy={helpText || hasErrors ? auxId : null}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseDown={onMouseDown}
        value={value}
        onChange={onChange}
      />
    </Field>
  );
}

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  columns: PropTypes.number,
  color: PropTypes.oneOf(COLORS),
  showCircles: PropTypes.bool,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onMouseDown: PropTypes.func,
  optional: PropTypes.bool,
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  validateData: PropTypes.any,
  testId: PropTypes.string,
};

export default RadioGroup;

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import useTheme from "../../hooks/useTheme";
import useBackground from "../../hooks/useBackground";
import useResponsivePropsCSS from "../../hooks/useResponsivePropsCSS";

const VARIANTS = ["text", "numeric"];
const COLORS = ["grey.t05", "white"];

const NUMERIC_REGEX = /^\d*$/;

const DEFAULT_PROPS = {
  variant: "text",
  color: "grey.t05",
  disabled: false,
  pasteAllowed: true,
  isValid: true,
  __internal__focus: false,
};

InternalInput.VARIANTS = VARIANTS;
InternalInput.COLORS = COLORS;
InternalInput.NUMERIC_REGEX = NUMERIC_REGEX;
InternalInput.DEFAULT_PROPS = DEFAULT_PROPS;

function InternalInput(_props) {
  const props = { ...DEFAULT_PROPS, ..._props };
  const {
    name,
    parentName,
    id,
    placeholder,
    variant,
    numericPrefix,
    numericSuffix,
    maxLength,
    disabled,
    pasteAllowed,
    isValid,
    describedBy,
    onFocus,
    onBlur,
    value,
    onChange,
    __internal__focus,
  } = props;
  const theme = useTheme();
  const { inputColorMap } = useBackground();
  const inputCSS = useResponsivePropsCSS(props, DEFAULT_PROPS, {
    color: (propsAtBreakpoint, theme, bp) => {
      const color = _props.color ?? inputColorMap[bp];

      return theme.input.getCSS({
        targetElement: "input",
        variant,
        numericPrefix,
        numericSuffix,
        color,
        __internal__focus,
      });
    },
  });
  const onPaste = useCallback(
    (event) => {
      if (!pasteAllowed) {
        event.preventDefault();
      }
    },
    [pasteAllowed]
  );

  return (
    <div
      css={theme.input.getCSS({
        targetElement: "inputContainer",
        variant,
        numericPrefix,
        numericSuffix,
      })}
    >
      <input
        css={inputCSS}
        id={id}
        name={name}
        data-parent-name={parentName}
        placeholder={placeholder}
        type="text"
        {...(variant === "numeric" && {
          // See: https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers
          inputMode: "numeric",
          pattern: "[0-9]*",
        })}
        maxLength={maxLength}
        disabled={disabled}
        onPaste={onPaste}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-invalid={isValid ? null : "true"}
        aria-describedby={describedBy}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

InternalInput.propTypes = {
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  variant: PropTypes.oneOf(VARIANTS),
  numericPrefix: PropTypes.string,
  numericSuffix: PropTypes.string,
  maxLength: PropTypes.string,
  color: PropTypes.oneOf(COLORS),
  disabled: PropTypes.bool,
  pasteAllowed: PropTypes.bool,
  isValid: PropTypes.bool,
  describedBy: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  __internal__focus: PropTypes.bool,
};

export default InternalInput;

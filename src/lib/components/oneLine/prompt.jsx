import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
} from "react";
import ToolTip from "../tooltip.jsx";

const DEFAULT_SCRIPT_TAG = `<script type='text/javascript' src="http://repl.disent.com/drepl.js" async></script>
<!-- Disent REPL END -->`;
const DEFAULT_DIV_OPEN_TAG = `<!-- Disent REPL BEGIN -->
<div class="disent-embed"`;

const Prompt = forwardRef((props, ref) => {
  const { imports, language, inlineStyles } = props;
  //------------STATES---------------------
  //----------------REFS---------------------
  //----------HELPER FUNCTIONS----------------
  const toolTipInnerHTML = useMemo(() => {
    switch (language) {
      case "bash":
        return (
          <div>
            <span style={{ color: "green" }}>user</span>:
            <span style={{ color: "blue" }}>~/dir</span>$
          </div>
        );
      default:
        return <div> &gt;&gt;&gt;</div>;
    }
  }, [language]);

  //-----------------USEEFFECTS-----------------------

  return (
    <div className="prompt repl-input" ref={ref} style={inlineStyles}>
      <ToolTip imports={imports} innerComponentHTML={toolTipInnerHTML} />
    </div>
  );
});

export default Prompt;

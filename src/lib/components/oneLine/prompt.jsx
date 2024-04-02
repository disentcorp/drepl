import React, { useState, useEffect, useCallback, useRef, useMemo,forwardRef } from "react";
import ToolTip from "../tooltip.jsx";


const DEFAULT_SCRIPT_TAG = `<script type='text/javascript' src="http://repl.disent.com/drepl.js" async></script>
<!-- Disent REPL END -->`;
const DEFAULT_DIV_OPEN_TAG = `<!-- Disent REPL BEGIN -->
<div class="disent-embed"`;

const Prompt = forwardRef((props,ref) => {
  const {   
    imports,
    language,
    inlineStyles
    } = props;
  //------------STATES---------------------
  //----------------REFS---------------------
  //----------HELPER FUNCTIONS----------------
  const toolTipInnerHTML = useMemo(()=>{
    switch(language){
        case "bash":
            return(
                <div>
                    <span style={{color:'green'}}>user</span>:<span style={{color:'blue'}}>~/dir</span>$
                    </div>
                )  
        default:
    return(
    <div> &gt;&gt;&gt;</div>
    )                
    }

},[language])


// const generateNewHTMLString = useCallback(() => {
//     let paramString = "";
//     const currentParams = { defaultInput, width, inputRatio, vertical, imports };
//     Object.keys(currentParams).forEach((param) => {
//       const paramValue = currentParams[param];
//       if (paramValue && paramValue !== "") {
//         const paramAsString = `${paramValue}`;
//         paramString += ` data-${param.toLowerCase()}='${paramAsString.replace(/'/g, "&#39;").replace(/"/g, "&quot;")}'`;
//       }
//     });
//     return DEFAULT_DIV_OPEN_TAG + paramString + "></div>\n" + DEFAULT_SCRIPT_TAG;
//   }, [defaultInput, width, inputRatio, vertical]);
  //-----------------USEEFFECTS-----------------------

  return (
    <div className="prompt repl-input"
    ref={ref}
    style={inlineStyles}
    >
    <ToolTip
    imports={imports}
    innerComponentHTML={toolTipInnerHTML}
    />
    </div>
  );
});

export default Prompt;

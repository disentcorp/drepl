import React, { useCallback, useEffect, useState, useRef } from "react";

import CommandLine from "./commandline.jsx";
import Console from "./console.jsx";
import Prompt from "./prompt.jsx";
import ReactGA from 'react-ga4'

import "../styles/repl.css";

const LARGE_SIZE = "850px";
const MEDIUM_SIZE = "525px";
const SMALL_SIZE = "400px";

const MINIMUM_WIDTH = 200;
const DEFAULT_WIDTH = MEDIUM_SIZE;
const MINIMUM_INPUT_WIDTH = 45;
const SINGLE_LINE_HEIGHT = 35;
const REPL_CALL_TIMEOUT = 5000;

const PROMPT_WIDTHS = {
  python: 34,
  bash: 104,
};

const Repl = (props) => {
  const {
    defaultInput = "",
    defaultOutput = "",
    imports = "",

    runOnLoad = true,
    disabled = false,

    multiLine = false,
    language = "python",
    width = "525px",
    height = "225px",
    inputRatio = 40, //pct of total width taken up by input

    replURI = "https://repl.disent.com",

    exposeCurrentCommand = null, //used if parent component needs to know what cmd is currently run
    exposeCurrentOutput = null,
  } = props;

  //---------------CONSTANTS----------------
  const MINIMUM_HEIGHT = multiLine ? 70 : 35;
  const DEFAULT_HEIGHT = multiLine ? 525 : 35;
  //
  //------------STATES---------------------
  const [commandHistory, setCommandHistory] = useState([defaultInput]);
  const [outputHistory, setOutputHistory] = useState([defaultOutput]);

  //-------------REFS--------------------------
  const replRef = useRef();
  const promptRef = useRef();
  const currentCallId = useRef(0);
  //------------HELPER FUNCTIONS------------------------
  const computeCurrentCommand = useCallback(
    async (currentCommand, callId) => {
      if (!disabled) {
        if (currentCommand !== "") {
          const encodedCommand = encodeURIComponent(currentCommand);
          const encodedImports = encodeURIComponent(imports);
          //shove imports in here when ready
          const BASE = replURI;
          let url = `${BASE}/api/?code=${encodedCommand}&colorize=true&imports=${encodedImports}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            REPL_CALL_TIMEOUT,
          );
          ReactGA.event({		
          category: 'User',
          action: 'API Call'})
          try {
            const response = await fetch(url, {
              method: "GET",
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
              throw new Error("Bad API request");
            }
            const data = await response.text();
            if (currentCallId.current === callId) {
              setOutputHistory((p) => [...p, `${data}`]);
            }
          } catch (error) {
            if (currentCallId.current === callId) {
              if (currentCommand !== defaultInput) {
                if (error.name === "AbortError") {
                  setOutputHistory((p) => [
                    ...p,
                    `Server Timeout. Try again later.`,
                  ]);
                } else {
                  setOutputHistory((p) => [
                    ...p,
                    `Too much traffic. Try again later.`,
                  ]);
                }
              } else {
                setOutputHistory((p) => [...p, `${defaultOutput}`]);
              }
            }
          }
        } else {
          const data = "";
          if (currentCallId.current === callId) {
            setOutputHistory((p) => [...p, `${data}`]);
          }
        }
      }
    },
    [setOutputHistory, imports, disabled, defaultInput, defaultOutput],
  );

  //------------------styling

  const getWidgetWidth = useCallback((size) => {
    if (size === "lg" || size === "large" || size === "big") {
      return LARGE_SIZE;
    } else if (size === "sm" || size === "small" || size === "tiny") {
      return SMALL_SIZE;
    } else if (size === "md" || size === "medium" || size === "default") {
      return MEDIUM_SIZE;
    } else if (typeof size === Number) {
      const minimumSize = Math.max(200, size);
      return `${minimumSize}px`;
    } else if (!isNaN(+size)) {
      const numSize = +size;
      return `${Math.max(200, numSize)}px`;
    } else if (typeof size === "string" && size?.endsWith("px")) {
      const numSize = +size.slice(0, size.length - 2);
      return isNaN(numSize) ? MEDIUM_SIZE : `${Math.max(200, numSize)}px`;
    } else {
      return MEDIUM_SIZE; //default if improperly formatted
    }
  }, []);

  const getWidthAsNumber = (rawWidth) => {
    const width = getWidgetWidth(rawWidth);
    if (typeof width === Number) {
      const minimumSize = Math.max(MINIMUM_WIDTH, width);
      return minimumSize;
    } else if (!isNaN(+width)) {
      const numSize = +width;
      return Math.max(MINIMUM_WIDTH, numSize);
    } else if (typeof width === "string" && width?.endsWith("px")) {
      const numSize = +width.slice(0, width.length - 2);
      return isNaN(numSize) ? DEFAULT_WIDTH : Math.max(200, numSize);
    } else {
      return 525; //default if improperly formatted
    }
  };

  const getHeightAsNumber = useCallback(
    (height) => {
      if (typeof height === Number) {
        const minimumSize = Math.max(MINIMUM_HEIGHT, height);
        return minimumSize;
      } else if (!isNaN(+height)) {
        const numSize = +height;
        return Math.max(MINIMUM_HEIGHT, numSize);
      } else if (typeof height === "string" && height?.endsWith("px")) {
        const numSize = +height.slice(0, height.length - 2);
        return isNaN(numSize)
          ? DEFAULT_HEIGHT
          : Math.max(MINIMUM_HEIGHT, numSize);
      } else {
        return DEFAULT_HEIGHT; //default if improperly formatted
      }
    },
    [DEFAULT_HEIGHT, MINIMUM_HEIGHT],
  );

  const getHeightInputRatio = useCallback(
    (ratio) => {
      const numRatio = +ratio;
      let adjustedRatio =
        numRatio > 0 && numRatio < 1 ? numRatio : numRatio / 100;
      let minInputRatio = SINGLE_LINE_HEIGHT / getHeightAsNumber(height);
      let maxInputRatio = 1 - minInputRatio; //by symmetry
      return Math.min(
        Math.max(minInputRatio * 100, adjustedRatio * 100),
        maxInputRatio * 100,
      );
    },
    [height, MINIMUM_HEIGHT, getHeightAsNumber],
  );

  const getWidthInputRatio = useCallback(
    (ratio) => {
      const numRatio = +ratio;
      let adjustedRatio =
        numRatio > 0 && numRatio < 1 ? numRatio : numRatio / 100;
      if (adjustedRatio > 0.95) {
        return 95;
      }
      let numWidgetSize = getWidthAsNumber(width);
      let minInputRatio = MINIMUM_INPUT_WIDTH / numWidgetSize;
      return Math.max(minInputRatio * 100, adjustedRatio * 100);
    },
    [width],
  );

  const getPromptStyle = useCallback(() => {
    if (multiLine) {
      var multiStyle = {
        width: PROMPT_WIDTHS[language],
        height: `${getHeightInputRatio(inputRatio)}%`,
      };
    } else {
      var multiStyle = { width: PROMPT_WIDTHS[language] };
    }
    let colorScheme = language === "bash" ? "rgba(50,50,50,1)" : "black";
    return {
      ...multiStyle,
      backgroundColor: colorScheme,
      border: `1px solid ${colorScheme}`,
    };
  }, [inputRatio, multiLine, getHeightInputRatio, language]);

  const getInputStyle = useCallback(() => {
    var promptWidth = PROMPT_WIDTHS[language];
    var w = getWidthAsNumber(width);
    var h = getHeightAsNumber(height);
    if (multiLine) {
      //do not ask me why the .4 is necessary (???) -c
      var multiStyle = {
        width: `${w - promptWidth}px`,
        height: `${getHeightInputRatio(inputRatio)}%`,
      };
    } else {
      var multiStyle = {
        width: `calc(${getWidthInputRatio(inputRatio)}% - ${promptWidth}px)`,
        height: MINIMUM_HEIGHT,
      };
    }
    let colorScheme = language === "bash" ? "rgba(50,50,50,1)" : "black";
    return {
      ...multiStyle,
      backgroundColor: colorScheme,
      border: `1px solid ${colorScheme}`,
    };
  }, [
    inputRatio,
    language,
    getWidthInputRatio,
    multiLine,
    width,
    height,
    MINIMUM_HEIGHT,
    getHeightAsNumber,
    getHeightInputRatio,
    commandHistory,
  ]);

  //
  const getOutputStyle = useCallback(() => {
    var promptWidth = PROMPT_WIDTHS[language];
    var w = replRef?.current?.offsetWidth
      ? replRef?.current?.offsetWidth
      : getWidthAsNumber(width);
    var h = getHeightAsNumber(height);
    if (multiLine) {
      return {
        width,
        height: `${100 - getHeightInputRatio(inputRatio)}%`,
        borderLeft: "1px solid black",
      };
    } else {
      return {
        width: `calc(${100 - getWidthInputRatio(inputRatio)}% - ${promptWidth}px)`,
        height: MINIMUM_HEIGHT,
      };
    }
  }, [
    inputRatio,
    getWidthInputRatio,
    multiLine,
    height,
    width,
    MINIMUM_HEIGHT,
    getHeightAsNumber,
    getHeightInputRatio,
    language,
  ]);

  //--------------USE EFFECT------------------------
  useEffect(() => {
    ReactGA.initialize('G-PS2EH759RQ');
    // Send pageview with a custom path
    ReactGA.send({ hitType: "pageview", page: "/landingpage", title: "Landing Page" });
}, [])
  useEffect(() => {
    if (runOnLoad) {
      computeCurrentCommand(defaultInput, currentCallId.current);
    }
  }, [runOnLoad, computeCurrentCommand, defaultInput, defaultOutput]);

  useEffect(() => {
    if (exposeCurrentCommand !== null) {
      //sets state above
      exposeCurrentCommand(commandHistory[commandHistory.length - 1]);
    }
  }, [commandHistory, exposeCurrentCommand]);

  useEffect(() => {
    if (exposeCurrentOutput !== null) {
      //sets state aboves
      exposeCurrentOutput(outputHistory[outputHistory.length - 1]);
    }
  }, [outputHistory, exposeCurrentOutput]);

  return (
    <div
      className="repl"
      ref={replRef}
      style={disabled ? {
        width: getWidgetWidth(width),
        height: multiLine ? height : MINIMUM_HEIGHT,
        cursor: 'not-allowed' 
      } : {
        width: getWidgetWidth(width),
        height: multiLine ? height : MINIMUM_HEIGHT
      }}
    >
      <Prompt
        ref={promptRef}
        language={language}
        imports={imports}
        inlineStyles={getPromptStyle()}
      />
      <CommandLine
        defaultInput={defaultInput}
        inlineStyles={getInputStyle()}
        commandHistory={commandHistory}
        setCommandHistory={setCommandHistory}
        computeCurrentCommand={computeCurrentCommand}
        imports={imports}
        currentCallId={currentCallId}
        language={language}
        disabled={disabled}
      />
      <Console
        inlineStyles={getOutputStyle()}
        outputHistory={outputHistory}
        setOutputHistory={setOutputHistory}
        exposeCurrentOutput={exposeCurrentOutput}
      />
    </div>
  );
};

export default Repl;

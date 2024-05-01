import React, { useCallback, useState, useRef, useMemo } from "react";

const DEBOUNCE_WAIT_TIME = 50; //MS
const EXCLUDED_COMMAND_KEYS = ["ArrowLeft", "ArrowRight"];

const CommandLine = (props) => {
  const {
    commandHistory,
    setCommandHistory,
    computeCurrentCommand,
    currentCallId,
    imports,
    language,
    inlineStyles,
    disabled,
  } = props;
  //----------CONSTANTS------------------
  //------------STATES---------------------
  const [currentCommand, setCurrentCommand] = useState(
    commandHistory[commandHistory.length - 1],
  ); //input box value
  //---------------REFS-------------------------------------------------
  const commandDebouncer = useRef(); //assigned setTimeout(()=>onKeyUp()) to be executed 50ms later

  //-------------MEMOS------------------------------------------

  //------------HELPER FUNCTIONS------------------------
  const onCommandChange = useCallback(
    (e) => {
      //updates input value
      e.preventDefault();
      const newCommand = e.target.innerText;
      setCurrentCommand(newCommand);
    },
    [setCurrentCommand],
  );

  const onCommandKeyUp = useCallback(
    (e) => {
      //debounces and sends cmd to server
      const currentKey = e.key;
      switch (currentKey) {
        case "a": {
          const isSelectAll = e.ctrlKey;
          if (isSelectAll) {
            break; //dont default if ctrl+a
          }
          //allow waterfall to default in case not ctrl+a
        }
        case "Control": {
          break; //ctrl is excused
        }
        default: {
          if (!EXCLUDED_COMMAND_KEYS.includes(currentKey)) {
            clearTimeout(commandDebouncer.current);
            commandDebouncer.current = setTimeout(() => {
              e.preventDefault();
              let cmd = e.target.innerText;
              setCommandHistory((p) => [...p, cmd]);
              currentCallId.current += 1;
              computeCurrentCommand(cmd, currentCallId.current);
            }, DEBOUNCE_WAIT_TIME);
          }
          break;
        }
      }
    },
    [computeCurrentCommand, currentCallId, setCommandHistory],
  );

  //------------------USE EFFECTS-------------------

  return (
    <div
      className="drepl-command drepl-input"
      contentEditable={!disabled}
      autoComplete="off"
      onKeyUp={onCommandKeyUp}
      dangerouslySetInnerHTML={{ __html: currentCommand }}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      style={{ ...inlineStyles }}
    ></div>
  );
};

export default CommandLine;

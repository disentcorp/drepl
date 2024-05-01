import React, { useState, useEffect, useCallback, useRef } from "react";

const Console = (props) => {
  const { outputHistory, setOutputHistory, inlineStyles, exposeCurrentOutput } =
    props;
  //------------STATES---------------------
  const [currentOutput, setCurrentOutput] = useState(outputHistory.slice(-1));
  //----------------REFS---------------------
  const innerHTMLRef = useRef();
  //----------HELPER FUNCTIONS----------------

  const onOutputKeyUp = useCallback(
    (e) => {
      //debounces and sends cmd to server
      if (exposeCurrentOutput !== null) {
        const currentKey = e.key;
        const currentTarget = e.target;
        const currentText = currentTarget.innerText;
        if (currentText !== outputHistory[outputHistory.length - 1]) {
          exposeCurrentOutput(currentText);
        }
      }
    },
    [outputHistory],
  );
  //-----------------USEEFFECTS-----------------------
  useEffect(() => {
    setCurrentOutput(outputHistory.slice(-1));
    //remove text from html
  }, [outputHistory]);

  useEffect(() => {
    var preChild = innerHTMLRef.current.querySelector("pre");
    var preChildText = preChild?.innerText;
    if (exposeCurrentOutput !== null && preChildText) {
      exposeCurrentOutput(preChildText);
    }
  }, [currentOutput]);

  // return (
  //   <div className="repl-input-div">
  //     <div ref={innerHTMLRef} contentEditable={exposeCurrentOutput !== null}
  //     className="repl-input repl-apioutput"
  //     dangerouslySetInnerHTML={{ __html: currentOutput }}
  //     onKeyUp={onOutputKeyUp}></div>
  //   </div>
  // );

  return (
    <div
      ref={innerHTMLRef}
      className="drepl-console drepl-output"
      style={{ ...inlineStyles }}
      contentEditable={exposeCurrentOutput !== null}
      dangerouslySetInnerHTML={{ __html: currentOutput }}
      onKeyUp={onOutputKeyUp}
    ></div>
  );
};

export default Console;

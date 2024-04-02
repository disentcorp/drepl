import React, { useState, useEffect } from "react";

import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";

const ToolTip = (props) => {
  const { 
    imports,
    innerComponentHTML,

} = props;
  //------------STATES---------------------
  //-----------------USEEFFECTS-----------------------

  return (
    <Tooltip
      position="bottom"
      animateFill={false}
      // arrow
      trigger="click"
      interactive
      html={(
        <div style={{display:'flex',flexDirection:'column'}}>
        <div style={{paddingTop:10,textAlign:"left"}}><pre>{imports}</pre></div>
        <a className='tooltiplink' href='https://repl.disent.com'>repl.disent.com</a>    
        {/* <button className="copy-button" onClick={copyHTMLToClipboard}>copy embed code</button> */}
        {/* <div style={{paddingTop:10,paddingBottom:10}}><a href='https://www.disent.com'><img style={{height:'20px',opacity:0.4}} src={disent_logo} alt='www.disent.com'></img></a></div>                     */}
        </div>
        )}
    >
      {innerComponentHTML}
    </Tooltip>
  );
};

export default ToolTip;

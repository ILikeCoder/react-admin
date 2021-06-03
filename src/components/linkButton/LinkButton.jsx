import React from "react";
import "./LinkButton.less";
export default function LinkButton(props) {
  return (
    <button className='linkButton' {...props}>
      {props.children}
    </button>
  );
}

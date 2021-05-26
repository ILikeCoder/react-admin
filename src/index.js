import React from "react";
import ReactDom from "react-dom";

import App from "./App";
import memoryUtils from "./utils/memoryUtils";
import { getUser } from "./utils/storageUtils";
console.log("1");
let user = getUser();
memoryUtils.user = user;

ReactDom.render(<App />, document.getElementById("root"));

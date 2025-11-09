import React, { useEffect, useState } from "react";
import Main from "./Main";
import "./App.css";

export default function App() {
  return (
    <div className="general"> {/* Changed 'class' to 'className' */}
      <Main />
    </div>
  );
}
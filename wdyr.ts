/// <reference types="@welldone-software/why-did-you-render" />

import React from "react";

// Make sure to only include the library in development
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true
  });

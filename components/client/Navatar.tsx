"use client";

import React, { useState } from "react";

const Navatar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn)
    return (
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
          <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
        </div>
      </div>
    );
  else
    return (
      <button className="btn btn-outline" onClick={() => setLoggedIn(true)}>
        Login
      </button>
    );
};

export default Navatar;

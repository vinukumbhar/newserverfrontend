import React from "react";
import { DocusealForm } from '@docuseal/react';

function App() {
 
  return (
    <div className="app">
      <DocusealForm
        src="https://docuseal.com/s/ox2fuCCRS3mGt1" // <-- Replace with your actual template URL
        email="janavijpatil0406+test@gmail.com"     // Optional: prefill signer email
        onComplete={(data) => console.log("Form signed", data)}
      />
    </div>
  );
}

export default App;

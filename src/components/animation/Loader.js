import React, { useEffect, useState } from "react";

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a loading delay (for demo purposes, you can replace with actual loading state)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 800ms (simulating page load)
    }, 500); // Adjust this value based on your actual load time or API fetch
    return () => clearTimeout(timer); // Cleanup timeout if component unmounts
  }, []);

  return (
    isLoading && (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <video
          className="w-50% h-50% object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="/loader.webm" // Ensure this file is placed in the public folder
          type="video/webm"
        ></video>
      </div>
    )
  );
};

export default Loader;

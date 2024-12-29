import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileContext } from "../contexts/Context";
import './UploadFile.css'; 

const UploadFile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setFileURL } = useContext(FileContext);

  // State for drag status
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Track processing state

  // This function handles file upload directly and separately from the "Processing" logic.
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      startProcessing(selectedFile);
    }
  };

  // Separate function to handle the processing and set the processing state
  const startProcessing = (file) => {
    setIsProcessing(true); // Show "Processing..." state
    // Simulate a delay for file processing (e.g., 2 seconds)
    setTimeout(() => {
      processFile(file);
    }, 2000); // 2-second delay
  };

  // Actual file processing function
  const processFile = (file) => {
    try {
      const fileURL = URL.createObjectURL(file);
      setFileURL(fileURL);
      navigate("/edit");
    } catch (error) {
      console.log("Error processing file:", error);
    } finally {
      setIsProcessing(false); // Hide "Processing..." state after processing
    }
  };

  // Drag-and-drop functionality
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragHover = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      startProcessing(droppedFile); // Trigger processing for the dropped file
    }
  };

  return (
    <main className="flex justify-center items-center">
      <section className="w-full max-w-lg p-6 bg-white shadow-2xl rounded-lg">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Upload Your Audio File</h1>
        
        {/* Drag-and-Drop Zone */}
        <div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDragHover}
          onDrop={handleDrop}
          style={{
            border: isProcessing
              ? "none"
              : isDragging
              ? "dashed"
              : "2px dashed blueviolet",
            padding: "30px",
            textAlign: "center",
            cursor: isProcessing ? "not-allowed" : "pointer", // Disable cursor while processing
          }}
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg bg-purple-100 dark:bg-white-100 dark:border-white-200 transition-all duration-300 hover:opacity-75 ${
            isProcessing ? "opacity-100" : ""
          }`} // Hide drop zone effects while processing
          onClick={() => !isProcessing && fileInputRef.current.click()} // Disable click while processing
        >
          {/* Show Processing Button only when processing */}
          {isProcessing ? (
            <button
              type="button"
              className="bg-indigo-500 text-white px-4 py-2 mt-4 rounded-md flex items-center justify-center cursor-not-allowed"
              disabled
            >
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2z"
                  className="opacity-75"
                />
              </svg>
              Uploading...
            </button>
          ) : (
            <>
              {/* Icon and Instructions */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-12 h-12 mb-4 text-purple-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-black dark:text-black">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            </>
          )}
  
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            id="file"
            className="hidden"
            accept="audio/*"
            onChange={handleFileUpload}
          />
        </div>
      </section>
    </main>
  );
};

export default UploadFile;

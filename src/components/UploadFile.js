 import { useContext, useRef, useState } from 'react'
 import { useNavigate } from 'react-router-dom'
 import  {FileContext}  from '../contexts/Context'

const UploadFile = () =>{
    //navigate to /edit if success
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const { setFileURL } = useContext(FileContext)
     //state for drag status
    const [isDragging, setIsDragging] = useState(false)
    
    //function that handles any file uploaded directly or dropped
    const processFile = (file) => {
        // Safety check - if no file, exit the function
        if(!file){
            console.log("file empty")
            return
        }
         //try create url and set the file
        try{
            const fileURL = URL.createObjectURL(file)
            setFileURL(fileURL)
            navigate('/edit')
        }catch(error){
            console.log(error)
        }
    }

    const handleFileUpload = (e) =>{
        //we need to get the file .target
        const selectedFile = e.target.files[0]
        processFile(selectedFile)
    }

    //drag drop functionality
    //later remove logs!!!
    //useful for styling
    const handleDragIn = (e) =>{
        //stopPropagation is like saying stops here dont tell my parents
        //which could be other nested divs etc.
        e.preventDefault()
        e.stopPropagation()
        console.log("dropped inside is called")
        setIsDragging(true)
    }
    const handleDragOut = (e) =>{
        e.preventDefault()
        e.stopPropagation()

        setIsDragging(false)
        console.log("draggedout is called")
    } 
    //Fires nonstop while a file is being dragged over the drop zone
    const handleDragHover = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        
        console.log("hovering...")
    }   
    const handleDrop = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const droppedFile = e.dataTransfer.files[0]
        processFile(droppedFile)
        console.log("file dropped")
    }
    
    return (
        <main className="flex justify-center items-center">
          <section className="w-full max-w-sm">
            {/* Drag-and-Drop Zone */}
            <div
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDragHover}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px solid blue' : '2px solid black',
                padding: '20px'
            }}>
              {/* Split Button - Choose File and Dropdown */}
              <div className="flex justify-between items-center space-x-4">
                {/* Choose File Button */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  type="button"
                  className="transform hover:translate-y-[-5px] transition-all duration-300
                 bg-blue-500 px-8 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal
                 text-white flex items-center rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V10.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Choose File
                </button>
              </div>
    
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
}
export default UploadFile
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
    
    return(
        <main>
            <section>
        {/* Temporary styling on drop zone div, edit later*/}
        <div 
        onDragEnter={handleDragIn}     
        onDragLeave={handleDragOut}     
        onDragOver={handleDragHover}       
        onDrop={handleDrop}               
        style={{
            border: isDragging ? '2px solid blue' : '2px solid black',
            padding: '20px'
        }}
        > Drop Zone

            <label htmlFor='upload-file'></label>
            {/* Button is just UI */}
            <button 
            onClick ={() => fileInputRef.current.click()}>
				Upload
			</button>
            {/* Input is actual functionality, using ref we link input to button */}
			<input
				type='file'
                ref={fileInputRef}
				id='file'
				style={{ display: 'none' }}
				accept='audio/*'
				onChange={handleFileUpload}
			/>
        </div>
        </section>
        </main>
    )
}
export default UploadFile
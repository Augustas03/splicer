 import { useContext, useRef } from 'react'
 import { useNavigate } from 'react-router-dom'
 import  {FileContext}  from '../contexts/Context'

const UploadFile = () =>{
    //navigate to /edit if success
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const { setFileURL } = useContext(FileContext)
    

    const handleFileUpload = (e) =>{
        //we need to get the file .target
        const selectedFile = e.target.files[0]

        if(!selectedFile){
            console.log("file empty")
            return
        }
        
        //try create url and set the file
        try{
            const fileURL = URL.createObjectURL(selectedFile)
            setFileURL(fileURL)
            navigate('/edit')
        } catch(err){
            console.log(err)
        }
    }

    const handleDrag = () =>{
        console.log("drag is called")
    } 
    const handleDrop = () =>{
        console.log("drop is called")
    }
    
    return(
        <main>
            <section>
        <div 
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button">

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
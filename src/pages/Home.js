import UploadFile from "../components/UploadFile";
function Home(){
    return (
        <div>
        <h1>Slice the Wave</h1>
        <p>Edit your audio with ease</p>
        <div>
            <button onClick={UploadFile}>Upload</button>
        </div>
    </div>
    )
}

export default Home;
import {useEffect, useContext} from 'react';
import {FileContext} from '../contexts/Context';
import WaveSurfer from 'wavesurfer.js';
 
const Audio = () =>{
    const {fileURL} = useContext(FileContext)
    useEffect(() =>{
        const wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#F4A855',
            progressColor: '#383351',
        });
 
        if(fileURL){
            wavesurfer.load(fileURL)
        }
 
        return () => wavesurfer.destroy()
    }, [fileURL]);
    return(
        <div id='waveform'>
        </div>
    )
}
export default Audio;
import {useEffect, useRef, useContext, useState} from 'react';
import {FileContext} from '../../contexts/Context';
import { useNavigate } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
 
import './Audio.css';
 
import{
    BsSkipBackward,
    BsSkipForward,
    BsFillStopFill,
    BsFillPlayFill,
    BsArrowLeft,
    BsArrowCounterclockwise
} from "react-icons/bs"
 
const Audio = () =>{
    const navigate = useNavigate();
    //this is for rendering
    const waveFormRef = useRef(null)
    //this is for storing
    const waveSurferRef = useRef(null)
    const timelineRef = useRef(null);
 
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
 
    const {fileURL} = useContext(FileContext)
   
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };
 
    useEffect(() =>{
        //we are using useRef to avoid re-rendering each time a change occurs
        //in component. Imagine user is playing with the waveform and
        //component re-renders due to parent update,state change etc
        //could cause lots of issues with play/pause clicking etc.
 
        //.current gives direct access to whatever is stored in the ref
        //so entire wavesurfer instance will all properties and methods
        waveSurferRef.current = WaveSurfer.create({
            //use DOM element for rendering container
            container: waveFormRef.current,
            waveColor: '#34374B',
            progressColor: '#F90',
            dragToSeek: true,
            width: '100%',
            height: 92,
            hideScrollbar: true,
            normalize: true,
            barWidth: 3,        
            barGap: 3,          
            barHeight: 1,        
            barRadius: 3,        
            padding: 0,
            plugins: [
                TimelinePlugin.create({
                    container: timelineRef.current,
                    primaryColor: '#666',
                    primaryFontColor: '#888',
                    secondaryFontColor: '#444',
                }),
                RegionsPlugin.create({
                    dragSelection: false,
                    slop: 5
                })
            ]
        });
 
        if(fileURL){
            waveSurferRef.current.load(fileURL)
        }
       
        waveSurferRef.current.on('ready', () => {
            setDuration(formatTime(waveSurferRef.current.getDuration()));
           
            // Create initial region
            const regions = waveSurferRef.current.plugins[1]; // Get regions plugin instance
            regions.addRegion({
                start: waveSurferRef.current.getDuration() * 0.3,
                end: waveSurferRef.current.getDuration() * 0.7,
                color: 'rgba(66, 135, 245, 0.2)',
                drag: false,
                resize: true
            });
        });
 
        waveSurferRef.current.on('timeupdate', (currentTime) => {
            setCurrentTime(formatTime(currentTime));
        });
 
        waveSurferRef.current.on('play', () => setIsPlaying(true));
        waveSurferRef.current.on('pause', () => setIsPlaying(false));
 
        return () => waveSurferRef.current.destroy()
    }, [fileURL]);
 
    const handleStop= () =>{
        if(waveSurferRef.current){
            waveSurferRef.current.stop()
        }
    }
 
    const handlePlayPause =() => {
        if(waveSurferRef.current){
            waveSurferRef.current.playPause()
        }
    }
 
    const handleSkipForward = () =>{
        if(waveSurferRef.current){
            waveSurferRef.current.skip(2)
        }
    }
    const handleSkipBack = () =>{
        if(waveSurferRef.current){
            waveSurferRef.current.skip(-2)
        }
    }
   
    const handleBackNav = () =>{
        navigate('/')
    }
 
 
 
    return (
        <div className="player-container">
        <div className="player-box">
            <button
            onClick={handleBackNav}
            className='control-button back-button'
            >
            <BsArrowLeft/>
            </button>
            <div ref={waveFormRef} className="wave-container">
            </div>
            <div className="controls-container">
                <button onClick={handleSkipBack} className="control-button">
                    <BsSkipBackward/>
                </button>
                <button onClick={handlePlayPause} className="control-button play-button">
                    {isPlaying ? <BsFillStopFill/> : <BsFillPlayFill/>}
                </button>
                <button onClick={handleStop} className="control-button stop-button">
                    < BsArrowCounterclockwise/>
                </button>
                <button onClick={handleSkipForward} className="control-button">
                    <BsSkipForward/>
                </button>
            </div>
        </div>
    </div>
      );
}
export default Audio;
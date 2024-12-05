import {useEffect, useRef, useContext, useState} from 'react';
import {FileContext} from '../../contexts/Context';
import { useNavigate } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';

import './Audio.css';
import {
    BsSkipBackward,
    BsSkipForward,
    BsFillStopFill,
    BsFillPlayFill,
    BsArrowLeft,
    BsPauseFill,
    BsScissors
} from "react-icons/bs"

// Main Audio component for rendering waveform visualization and audio controls
const Audio = () =>{
    const navigate = useNavigate();
    // Ref for the DOM element where waveform will be rendered
    const waveFormRef = useRef(null);
    // Ref to store the WaveSurfer instance
    const waveSurferRef = useRef(null);
    // Ref for timeline container
    const timelineRef = useRef(null);

    // State management for player controls and time display
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');

    // Context for managing audio file URL
    const {fileURL, setFileURL} = useContext(FileContext);
   
    // Helper function to format time in MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    useEffect(() =>{
        // Initialize timeline plugin with custom styling
        const timeline = TimelinePlugin.create({
            container: timelineRef.current,
            primaryColor: '#9CA3AF',
            secondaryColor: '#4B5563',
            primaryFontColor: '#9CA3AF',
            secondaryFontColor: '#4B5563',
            height: 20,
        });

        // Initialize regions plugin for selection functionality
        const regions = RegionsPlugin.create({});

        // Create WaveSurfer instance with configuration
        waveSurferRef.current = WaveSurfer.create({
            container: waveFormRef.current,
            waveColor: '#34374B',
            progressColor: '#F97316',
            cursorColor: '#0000FF',
            height: 80,
            barWidth: 2,
            barGap: 2,
            barHeight: 0.8,
            barRadius: 2,
            cursorWidth: 2,
            normalize: true,
            responsive: true,
            hideScrollbar: true,
            minPxPerSec: 100,
            plugins: [timeline, regions]
        });

        // Load audio file if URL exists
        if(fileURL) {
            waveSurferRef.current.load(fileURL);
        }
       
        // Setup event handlers once WaveSurfer is ready
        waveSurferRef.current.on('ready', () => {
            setDuration(formatTime(waveSurferRef.current.getDuration()));
            
            // Enable drag selection for regions
            waveSurferRef.current.enableDragSelection({});
            
            // Create initial region spanning 30%-70% of audio duration
            waveSurferRef.current.addRegion({
                start: waveSurferRef.current.getDuration() * 0.3,
                end: waveSurferRef.current.getDuration() * 0.7,
                color: 'hsla(265, 100%, 86%, 0.4)',
                drag: true,
                resize: true
            });
        });

        // Ensure only one region exists at a time
        waveSurferRef.current.on('region-updated', (region) => {
            const regions = region.wavesurfer.regions.list;
            const keys = Object.keys(regions);
            if (keys.length > 1) {
                regions[keys[0]].remove();
            }
        });

        // Update current time display during playback
        waveSurferRef.current.on('audioprocess', () => {
            setCurrentTime(formatTime(waveSurferRef.current.getCurrentTime()));
        });

        // Update play/pause state
        waveSurferRef.current.on('play', () => setIsPlaying(true));
        waveSurferRef.current.on('pause', () => setIsPlaying(false));

        // Cleanup on component unmount
        return () => {
            if (waveSurferRef.current) {
                waveSurferRef.current.destroy();
            }
        };
    }, [fileURL]);
    
    // Handler functions for player controls
    const handleStop = () =>{
        if(waveSurferRef.current){
            waveSurferRef.current.stop();
        }
    };

    const handlePlayPause =() => {
        if(waveSurferRef.current){
            waveSurferRef.current.playPause();
        }
    };

    // Skip forward 2 seconds
    const handleSkipForward = () =>{
        if(waveSurferRef.current){
            const currentTime = waveSurferRef.current.getCurrentTime();
            waveSurferRef.current.seekTo((currentTime + 2) / waveSurferRef.current.getDuration());
        }
    };

    // Skip backward 2 seconds
    const handleSkipBack = () =>{
        if(waveSurferRef.current){
            const currentTime = waveSurferRef.current.getCurrentTime();
            waveSurferRef.current.seekTo(Math.max(0, (currentTime - 2)) / waveSurferRef.current.getDuration());
        }
    };
   
    // Navigate back to home page
    const handleBackNav = () =>{
        navigate('/');
    };

    return (
        <div className="player-container">
            <div className="player-box">
                <button
                    onClick={handleBackNav}
                    className='control-button back-button'
                >
                    <BsArrowLeft/>
                </button>
                {/* Waveform visualization container */}
                <div ref={waveFormRef} className="wave-container"></div>
                {/* Timeline display container */}
                <div ref={timelineRef} className="timeline-container"></div>
                <div className="time-display">
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                </div>
                {/* Player control buttons */}
                <div className="controls-container">
                    <button onClick={handleSkipBack} className="control-button">
                        <BsSkipBackward/>
                    </button>
                    <button onClick={handlePlayPause} className="control-button play-button">
                        {isPlaying ? <BsPauseFill/> : <BsFillPlayFill/>}
                    </button>
                    <button onClick={handleStop} className="control-button stop-button">
                        <BsFillStopFill/>
                    </button>
                    <button className="control-button trim-button">
                        <BsScissors/>
                    </button>
                    <button onClick={handleSkipForward} className="control-button">
                        <BsSkipForward/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Audio;
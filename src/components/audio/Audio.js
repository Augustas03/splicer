import {useEffect, useRef, useContext, useState} from 'react';
import {FileContext} from '../../contexts/FileContext';
import { useNavigate } from 'react-router-dom';
import Download from '../download/Download';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';

import './Audio.css';
 
import{
    BsSkipBackward,
    BsSkipForward,
    BsFillStopFill,
    BsFillPlayFill,
    BsArrowLeft,
    BsPauseFill,
    BsScissors,
    BsArrowReturnLeft,    
    BsArrowClockwise
} from "react-icons/bs"

// Main Audio component for rendering waveform visualization and audio controls
const Audio = () =>{
    const navigate = useNavigate();
    //this is for rendering
    const waveFormRef = useRef(null)
    //this is for storing
    const waveSurferRef = useRef(null)
    const timelineRef = useRef(null)
    const timelinePluginRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
    const [showDownload, setShowDownload] = useState(false);

    const {fileURL, setFileURL} = useContext(FileContext)

    // Add new state for tracking cuts
    const [cuts, setCuts] = useState([]);
    const [originalBuffer, setOriginalBuffer] = useState(null);
   
    // Helper function to format time in MM:SS format
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

        timelinePluginRef.current = TimelinePlugin.create({
            container: timelineRef.current,
            primaryFontColor: '#FFFFFF',
            secondaryFontColor: '#FFFFFF',
            primaryColor: '#34374B',
            secondaryColor: '#34374B',
            timeInterval: 15,
            height: 20
        });

        // Initialize regions plugin for selection functionality
        const regions = RegionsPlugin.create({});

        // Create WaveSurfer instance with configuration
        waveSurferRef.current = WaveSurfer.create({
            //use DOM element for rendering container
            container: waveFormRef.current,
            waveColor: '#34374B',
            progressColor: '#9d00ff',
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
            plugins: [timelinePluginRef.current, regions]
        });

        // Load audio file if URL exists
        if(fileURL) {
            waveSurferRef.current.load(fileURL);
        }
       
        waveSurferRef.current.on('ready', () => {
            // Only set duration for initial load (no cuts)
            if (cuts.length === 0) {
                setDuration(formatTime(waveSurferRef.current.getDuration()));
            }
            
            // Store original buffer
            setOriginalBuffer(waveSurferRef.current.backend.buffer);
            
            // Load saved cuts from localStorage
            const savedCuts = JSON.parse(localStorage.getItem('audiocuts') || '[]');
            setCuts(savedCuts);
            
            // Clear any existing regions first
            waveSurferRef.current.regions.clear();
            
            // If there are saved cuts, apply the last one
            if (savedCuts.length > 0) {
                const lastCut = savedCuts[savedCuts.length - 1];
                applyViewToCut(lastCut.start, lastCut.end);
            } else {
                // Create initial region if there are no saved cuts
                waveSurferRef.current.addRegion({
                    start: waveSurferRef.current.getDuration() * 0.3,
                    end: waveSurferRef.current.getDuration() * 0.7,
                    drag: true,
                    resize: true,
                    color: 'rgba(157, 0, 255, 0.2)',
                    preventContextMenu: true,
                    id: 'initial-region'
                });
                
                // Ensure we start from the beginning
                waveSurferRef.current.seekTo(0);
            }
        
            // Enable drag selection but don't let it interfere with playback
            waveSurferRef.current.enableDragSelection({
                preventContextMenu: true,
                color: 'rgba(157, 0, 255, 0.2)'
            });
        });
        waveSurferRef.current.on('region-updated', (region) => {
            // Get all regions
            const regions = region.wavesurfer.regions.list;
            const keys = Object.keys(regions);
            
            // If we have more than one region
            if (keys.length > 1) {
                // Keep only the most recently updated region
                const currentRegionId = region.id;
                keys.forEach(key => {
                    if (key !== currentRegionId) {
                        regions[key].remove();
                    }
                });
            }
        });

        // Update current time display during playback
        waveSurferRef.current.on('audioprocess', () => {
            setCurrentTime(formatTime(waveSurferRef.current.getCurrentTime()));
        });

        waveSurferRef.current.on('seek', () => {
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
    
    const handleTrim = () => {
        if (waveSurferRef.current) {
            const wasPlaying = isPlaying;
            
            if (wasPlaying) {
                waveSurferRef.current.pause();
            }
    
            const trimRegion = waveSurferRef.current.regions.list[
                Object.keys(waveSurferRef.current.regions.list)[0]
            ];
    
            if (trimRegion) {
                const newCut = {
                    start: trimRegion.start,
                    end: trimRegion.end,
                    timestamp: Date.now()
                };
    
                const newCuts = [...cuts, newCut];
                setCuts(newCuts);
                localStorage.setItem('audiocuts', JSON.stringify(newCuts));
    
                // Apply the view for this cut
                applyViewToCut(newCut.start, newCut.end, wasPlaying);
                
                // Update duration display with the new cut length
                const newDuration = trimRegion.end - trimRegion.start;
                setDuration(formatTime(newDuration));
                
                setShowDownload(true);
            }
        }
    };
    

    const handleStop= () =>{
        if(waveSurferRef.current){
            waveSurferRef.current.stop()
        }
    }

    // Skip forward 2 seconds
    const handleSkipForward = () =>{
        if(waveSurferRef.current){
            const currentTime = waveSurferRef.current.getCurrentTime();
            waveSurferRef.current.seekTo((currentTime + 2) / waveSurferRef.current.getDuration());
        }
    }
    const handleSkipBack = () =>{
        if(waveSurferRef.current){
            const currentTime = waveSurferRef.current.getCurrentTime();
            waveSurferRef.current.seekTo(Math.max(0, (currentTime - 2)) / waveSurferRef.current.getDuration());
        }
    }
   
    // Navigate back to home page and cleanup
const handleBackNav = () => {
    // Clean up localStorage
    localStorage.removeItem('audiocuts');
    
    // Reset the cuts state
    setCuts([]);
    
    // Reset download state
    setShowDownload(false);
    
    // Stop any playing audio before navigating
    if (waveSurferRef.current) {
        waveSurferRef.current.pause();
        waveSurferRef.current.destroy();
    }
    
    // Reset file URL context if needed
    setFileURL(null);
    
    // Navigate back to home
    navigate('/');
};
    
    // Function to apply view to specific cut points
    const applyViewToCut = (start, end, wasPlaying = false) => {
        if (waveSurferRef.current) {
            waveSurferRef.current.destroy();
    
            const containerWidth = waveFormRef.current.clientWidth;
            const regionDuration = end - start;
            
            // Ensure the waveform fits exactly in the container
            const pixelsPerSecond = Math.floor(containerWidth / regionDuration);
    
            const regions = RegionsPlugin.create();
    
            timelinePluginRef.current = TimelinePlugin.create({
                container: timelineRef.current,
                primaryFontColor: '#FFFFFF',
                secondaryFontColor: '#FFFFFF',
                primaryColor: '#34374B',
                secondaryColor: '#34374B',
                timeInterval: regionDuration <= 30 ? 5 : 15,
                height: 20,
                notchPercentHeight: 50,
                unlabeledNotchColor: '#34374B'
            });
    
            waveSurferRef.current = WaveSurfer.create({
                container: waveFormRef.current,
                waveColor: '#34374B',
                progressColor: '#9d00ff',
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
                minPxPerSec: pixelsPerSecond,
                maxCanvasWidth: containerWidth,  // Limit canvas width to container
                fillParent: true,
                closeAudioContext: true,
                plugins: [timelinePluginRef.current, regions]
            });
    
            // Create new Audio Context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            fetch(fileURL)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    const sampleRate = audioBuffer.sampleRate;
                    const startSample = Math.floor(start * sampleRate);
                    const endSample = Math.floor(end * sampleRate);
                    const newLength = endSample - startSample;
    
                    const trimmedBuffer = audioContext.createBuffer(
                        audioBuffer.numberOfChannels,
                        newLength,
                        sampleRate
                    );
    
                    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
                        const oldData = audioBuffer.getChannelData(channel);
                        const newData = trimmedBuffer.getChannelData(channel);
                        
                        for (let i = 0; i < newLength; i++) {
                            newData[i] = oldData[startSample + i];
                        }
                    }
    
                    // Load the trimmed buffer
                    waveSurferRef.current.loadDecodedBuffer(trimmedBuffer);
                });
    
                waveSurferRef.current.on('ready', () => {
                    const currentDuration = waveSurferRef.current.getDuration();
                    
                    // Clear any existing regions first
                    waveSurferRef.current.regions.clear();
                    
                    // Calculate new region boundaries (30-70% of current duration)
                    const regionStart = currentDuration * 0.3;
                    const regionEnd = currentDuration * 0.7;
                    
                    // Add region with new boundaries
                    waveSurferRef.current.addRegion({
                        start: regionStart,
                        end: regionEnd,
                        drag: true,
                        resize: true,
                        color: 'rgba(157, 0, 255, 0.2)'
                    });
                
                    // Ensure proper zoom and position
                    waveSurferRef.current.zoom(pixelsPerSecond);
                    waveSurferRef.current.seekTo(0);
                    
                    setDuration(formatTime(currentDuration));
                    setCurrentTime('00:00');
                
                    if (wasPlaying) {
                        setTimeout(() => {
                            waveSurferRef.current.play();
                        }, 100);
                    }
                });
    
            // Add strict playback boundary check
            waveSurferRef.current.on('audioprocess', () => {
                const currentTime = waveSurferRef.current.getCurrentTime();
                if (currentTime >= regionDuration) {
                    waveSurferRef.current.pause();
                    waveSurferRef.current.seekTo(0);
                    setCurrentTime('00:00');
                } else {
                    setCurrentTime(formatTime(currentTime));
                }
            });
    
            waveSurferRef.current.on('seek', () => {
                const currentTime = waveSurferRef.current.getCurrentTime();
                if (currentTime >= regionDuration) {
                    waveSurferRef.current.seekTo(0);
                    setCurrentTime('00:00');
                } else {
                    setCurrentTime(formatTime(currentTime));
                }
            });
    
            waveSurferRef.current.on('play', () => setIsPlaying(true));
            waveSurferRef.current.on('pause', () => setIsPlaying(false));
    
            // Handle region updates
            waveSurferRef.current.on('region-updated', (region) => {
                const regions = region.wavesurfer.regions.list;
                const keys = Object.keys(regions);
                if (keys.length > 1) {
                    const currentRegionId = region.id;
                    keys.forEach(key => {
                        if (key !== currentRegionId) {
                            regions[key].remove();
                        }
                    });
                }
                const updatedRegion = Object.values(regions)[0];
                if (updatedRegion) {
                    const newDuration = updatedRegion.end - updatedRegion.start;
                    setDuration(formatTime(newDuration));
                }
            });
        }
    };
    // Modify handlePlayPause to respect current cut region
    const handlePlayPause = () => {
        if (waveSurferRef.current) {
            const region = Object.values(waveSurferRef.current.regions.list)[0];
            const currentTime = waveSurferRef.current.getCurrentTime();
            const totalDuration = waveSurferRef.current.getDuration();
            
            if (!isPlaying) {
                // Always allow playback from current position
                waveSurferRef.current.play(currentTime);
                
                // Only add region boundary listener if we're starting within the region
                if (region && currentTime >= region.start && currentTime <= region.end) {
                    const onAudioprocess = () => {
                        const newCurrentTime = waveSurferRef.current.getCurrentTime();
                        if (newCurrentTime >= region.end) {
                            // Instead of pausing, just remove the listener
                            waveSurferRef.current.un('audioprocess', onAudioprocess);
                        }
                    };
                    waveSurferRef.current.on('audioprocess', onAudioprocess);
                }
            } else {
                waveSurferRef.current.pause();
            }
        }
    };
    // Add revert functionality
    const handleRevert = () => {
        if (cuts.length > 0) {
            if (waveSurferRef.current) {
                waveSurferRef.current.pause();
                
                const previousCuts = cuts.slice(0, -1);
                setCuts(previousCuts);
                localStorage.setItem('audiocuts', JSON.stringify(previousCuts));
    
                if (previousCuts.length > 0) {
                    const lastCut = previousCuts[previousCuts.length - 1];
                    applyViewToCut(lastCut.start, lastCut.end, false);
                    
                    // Update duration display with the previous cut length
                    const cutDuration = lastCut.end - lastCut.start;
                    setDuration(formatTime(cutDuration));
                } else {
                    // Return to original state
                    waveSurferRef.current.destroy();
    
                    const regions = RegionsPlugin.create();
                    timelinePluginRef.current = TimelinePlugin.create({
                        container: timelineRef.current,
                        primaryFontColor: '#FFFFFF',
                        secondaryFontColor: '#FFFFFF',
                        primaryColor: '#34374B',
                        secondaryColor: '#34374B',
                        timeInterval: 15,
                        height: 20
                    });
    
                    waveSurferRef.current = WaveSurfer.create({
                        container: waveFormRef.current,
                        waveColor: '#34374B',
                        progressColor: '#9d00ff',
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
                        plugins: [timelinePluginRef.current, regions]
                    });
    
                    setCurrentTime('00:00');
                    setIsPlaying(false);
    
                    waveSurferRef.current.load(fileURL);
    
                    waveSurferRef.current.on('ready', () => {
                        // Update duration display with the full audio length
                        setDuration(formatTime(waveSurferRef.current.getDuration()));
                        
                        waveSurferRef.current.seekTo(0);
                        
                        waveSurferRef.current.addRegion({
                            start: waveSurferRef.current.getDuration() * 0.3,
                            end: waveSurferRef.current.getDuration() * 0.7,
                            drag: true,
                            resize: true,
                            color: 'rgba(157, 0, 255, 0.2)',
                            preventContextMenu: true,
                            id: 'initial-region'
                        });
                    });
    
                    // Event listeners
                    waveSurferRef.current.on('audioprocess', () => {
                        setCurrentTime(formatTime(waveSurferRef.current.getCurrentTime()));
                    });
    
                    waveSurferRef.current.on('seek', () => {
                        const time = waveSurferRef.current.getCurrentTime();
                        setCurrentTime(formatTime(time));
                    });
    
                    waveSurferRef.current.on('play', () => setIsPlaying(true));
                    waveSurferRef.current.on('pause', () => setIsPlaying(false));
    
                    waveSurferRef.current.on('region-updated', (region) => {
                        const regions = region.wavesurfer.regions.list;
                        const keys = Object.keys(regions);
                        if (keys.length > 1) {
                            const currentRegionId = region.id;
                            keys.forEach(key => {
                                if (key !== currentRegionId) {
                                    regions[key].remove();
                                }
                            });
                        }
                    });
                }
            }
        }
    };

    const handleReset = () => {
        if (waveSurferRef.current) {
            // Stop any playing audio
            waveSurferRef.current.pause();
            
            // Clear all cuts from state and localStorage
            setCuts([]);
            localStorage.removeItem('audiocuts');
            
            // Destroy current instance
            waveSurferRef.current.destroy();
    
            // Initialize new plugins
            const regions = RegionsPlugin.create();
            timelinePluginRef.current = TimelinePlugin.create({
                container: timelineRef.current,
                primaryFontColor: '#FFFFFF',
                secondaryFontColor: '#FFFFFF',
                primaryColor: '#34374B',
                secondaryColor: '#34374B',
                timeInterval: 15,
                height: 20
            });
    
            // Recreate WaveSurfer with original settings
            waveSurferRef.current = WaveSurfer.create({
                container: waveFormRef.current,
                waveColor: '#34374B',
                progressColor: '#9d00ff',
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
                plugins: [timelinePluginRef.current, regions]
            });
    
            // Reset states
            setCurrentTime('00:00');
            setIsPlaying(false);
            setShowDownload(false);
    
            // Load original audio
            waveSurferRef.current.load(fileURL);
    
            waveSurferRef.current.on('ready', () => {
                // Set duration to full audio length
                setDuration(formatTime(waveSurferRef.current.getDuration()));
                
                // Reset cursor to beginning
                waveSurferRef.current.seekTo(0);
                
                // Add initial region
                waveSurferRef.current.addRegion({
                    start: waveSurferRef.current.getDuration() * 0.3,
                    end: waveSurferRef.current.getDuration() * 0.7,
                    drag: true,
                    resize: true,
                    color: 'rgba(157, 0, 255, 0.2)',
                    preventContextMenu: true,
                    id: 'initial-region'
                });
            });
    
            // Reattach event listeners
            waveSurferRef.current.on('audioprocess', () => {
                setCurrentTime(formatTime(waveSurferRef.current.getCurrentTime()));
            });
    
            waveSurferRef.current.on('seek', () => {
                const time = waveSurferRef.current.getCurrentTime();
                setCurrentTime(formatTime(time));
            });
    
            waveSurferRef.current.on('play', () => setIsPlaying(true));
            waveSurferRef.current.on('pause', () => setIsPlaying(false));
    
            waveSurferRef.current.on('region-updated', (region) => {
                const regions = region.wavesurfer.regions.list;
                const keys = Object.keys(regions);
                if (keys.length > 1) {
                    const currentRegionId = region.id;
                    keys.forEach(key => {
                        if (key !== currentRegionId) {
                            regions[key].remove();
                        }
                    });
                }
            });
        }
    };

    return (
        <div className="player-container">
            <div className="player-box">
            <button
                    onClick={handleBackNav}
                    className='control-button back-button outline'
                >
                    <BsArrowLeft/>
                </button>
                {showDownload && (
                    <Download
                    buffer={waveSurferRef.current.backend.buffer}
                    />
                )}
                {/* Waveform visualization container */}
                <div ref={waveFormRef} className="wave-container"></div>
                {/* Timeline display container */}
                <div ref={timelineRef} className="timeline-container"></div>
                <div className="time-display">
                    <span>{currentTime}/{duration}</span>
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
                    < BsFillStopFill/>
                    </button>
                    <button className="control-button trim-button outline" onClick={handleTrim}>
                        <BsScissors/>
                    </button>
                    <button 
                        className="control-button revert-button"
                        onClick={handleRevert}
                        disabled={cuts.length === 0}
                    >
                        <BsArrowReturnLeft/>
                    </button>
                    <button 
                        className="control-button reset-button"
                        onClick={handleReset}
                        disabled={cuts.length === 0}
                    >
                        <BsArrowClockwise/> 
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
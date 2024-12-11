import {useEffect, useRef, useContext, useState} from 'react';
import {FileContext} from '../../contexts/Context';
import { useNavigate } from 'react-router-dom';
import Download from '../Download';
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
       
        // Setup event handlers once WaveSurfer is ready
        waveSurferRef.current.on('ready', () => {
            setDuration(formatTime(waveSurferRef.current.getDuration()));
            
            // Enable drag selection for regions
            waveSurferRef.current.enableDragSelection({});
            
            // Create initial region spanning 30%-70% of audio duration
            waveSurferRef.current.addRegion({
                start: waveSurferRef.current.getDuration() * 0.3,
                end: waveSurferRef.current.getDuration() * 0.7,
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
    
    const handleTrim = () =>{
        if (waveSurferRef.current) {
			// get start and end points of the selected region
			const trimRegion = waveSurferRef.current.regions.list[
                Object.keys(waveSurferRef.current.regions.list)[0]
            ];
            //.start and .end gives us start(seconds.ms) and end(seconds.ms) to trim
            console.log(trimRegion)
            if (trimRegion) {
				const start = trimRegion.start;
				const end = trimRegion.end;

                const originalBuffer = waveSurferRef.current.backend.buffer;
                //gets duration of the cut
                console.log(originalBuffer)
                
                const trimDuration = end - start;
                const newSampleLength = Math.floor(trimDuration * originalBuffer.sampleRate);

            //create a new empty audio buffer with the same properties as original
            //ac-audiocontext
                const newBuffer = waveSurferRef.current.backend.ac.createBuffer(
                    originalBuffer.numberOfChannels,  //keep same number of channels 2 for stereo
                    newSampleLength,                  //original length
                    originalBuffer.sampleRate         //orginal sample rate
                );

                //memory allocation to do with samples
                const trimmedData = new Float32Array(newSampleLength);
                
                // Copy just the trimmed section for each channel
                for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
                    const startIndex = Math.floor(start * originalBuffer.sampleRate);
                    originalBuffer.copyFromChannel(trimmedData, channel, startIndex);
                    newBuffer.copyToChannel(trimmedData, channel);
                }

                // Finally, load this new trimmed audio into WaveSurfer to display and play
                waveSurferRef.current.loadDecodedBuffer(newBuffer);
                setShowDownload(true)
                handleTrimmedAudioTimeline(newBuffer);

                //may need to refactor destroy and re-adding of region. 
                waveSurferRef.current.regions.destroy()

                waveSurferRef.current.addRegion({
                    start: waveSurferRef.current.getDuration() * 0.3,
                    end: waveSurferRef.current.getDuration() * 0.7,
                    drag: true,
                    resize: true
                });
            }

    }
    }

    const handleStop= () =>{
        if(waveSurferRef.current){
            waveSurferRef.current.stop()
        }
    }

    const handleTrimmedAudioTimeline = (newBuffer) => {
        if(waveSurferRef.current){
            // Calculate new time interval
            const durationOfAudio = waveSurferRef.current.getDuration();
            let calculatedTimeInterval = 15;
    
            if (durationOfAudio <= 30) {
                calculatedTimeInterval = 5;
            } else if (durationOfAudio > 30 && durationOfAudio <= 70) {
                calculatedTimeInterval = 10;
            } else if (durationOfAudio > 70 && durationOfAudio <= 200){
                calculatedTimeInterval = 15;
            } else if(durationOfAudio > 200 && durationOfAudio <= 600){
                calculatedTimeInterval = 60;
            }else{
                calculatedTimeInterval = 90;
            }
            
    
            // Destroy the old wavesurfer instance
            waveSurferRef.current.destroy();
    
            // Create new timeline with new interval
            timelinePluginRef.current = TimelinePlugin.create({
                container: timelineRef.current,
                primaryFontColor: '#FFFFFF',
                secondaryFontColor: '#FFFFFF',
                primaryColor: '#34374B',
                secondaryColor: '#34374B',
                timeInterval: calculatedTimeInterval,
                height: 20
            });
    
            // Initialize regions plugin
            const regions = RegionsPlugin.create({});
    
            // Recreate WaveSurfer instance
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

            waveSurferRef.current.on('seek', () => {
            setCurrentTime(formatTime(waveSurferRef.current.getCurrentTime()));
            });

            // Update play/pause state
            waveSurferRef.current.on('play', () => setIsPlaying(true));
            waveSurferRef.current.on('pause', () => setIsPlaying(false));

            // Load the current audio buffer
            waveSurferRef.current.loadDecodedBuffer(newBuffer);

            setDuration(formatTime(waveSurferRef.current.getDuration()));

            // Cleanup on component unmount
            return () => {
                if (waveSurferRef.current) {
                    waveSurferRef.current.destroy();
                }
            };    
        }
    }

    const handlePlayPause =() => {
        if(waveSurferRef.current){
            waveSurferRef.current.playPause()
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
   
    // Navigate back to home page
    const handleBackNav = () =>{
        navigate('/')
    }
 
 

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
                   <button className="control-button revert-button premium-button" disabled>
                        <BsArrowReturnLeft/>
                    </button>
                    <button className="control-button reset-button premium-button" disabled>
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
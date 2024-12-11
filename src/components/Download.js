import { BsDownload } from "react-icons/bs";
import { useCallback } from 'react';
//handles the conversion of audio buffer to WAV format and downloads it
const Download = ({ buffer }) => {
    const audioBufferToWav = useCallback((audioBuffer) => {
        //calculate length of buffer and time by 2 because we are using 16bit samples
        const length = audioBuffer.length * audioBuffer.numberOfChannels * 2;
        //create a buffer for the WAV file 44 bytes header + audio data
        const buffer = new ArrayBuffer(44 + length);
        //creating a data view to write data to the buffer
        const view = new DataView(buffer);
        
        //write WAV header
        //RIFF identifier
        writeString(view, 0, 'RIFF');
        //file size
        view.setUint32(4, 36 + length, true);
        // WAVE identifier
        writeString(view, 8, 'WAVE');
        // fmt chunk
        writeString(view, 12, 'fmt ');
        // Chunk length
        view.setUint32(16, 16, true);
        //sample format (1 is PCM)
        view.setUint16(20, 1, true);
        //number of channels
        view.setUint16(22, audioBuffer.numberOfChannels, true);
        //sample rate
        view.setUint32(24, audioBuffer.sampleRate, true);
        // byte rate
        view.setUint32(28, audioBuffer.sampleRate * audioBuffer.numberOfChannels * 2, true);
        // block align
        view.setUint16(32, audioBuffer.numberOfChannels * 2, true);
        //bits per sample
        view.setUint16(34, 16, true);
        //data chunk
        writeString(view, 36, 'data');
        // Data length
        view.setUint32(40, length, true);
        
        //writing audio data
        floatTo16BitPCM(view, 44, audioBuffer);
        
        return buffer;
    }, []);
    
    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    //channels and memory 
    const floatTo16BitPCM = (view, offset, audioBuffer) => {
        const channels = [];
        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
            channels.push(audioBuffer.getChannelData(i));
        }
        
        let index = 0;
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let channel = 0; channel < channels.length; channel++) {
                const sample = Math.max(-1, Math.min(1, channels[channel][i]));
                view.setInt16(offset + index, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                index += 2;
            }
        }
    };

    const handleDownload = useCallback(() => {
        if (!buffer) return;
        try {
            //converting  buffer to WAV format
            const wavBuffer = audioBufferToWav(buffer);
            
            //blob and download link + url
            const blob = new Blob([wavBuffer], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            
            //temp link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'trimmed_audio.wav';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error during download:', error);
        }
    }, [buffer, audioBufferToWav]);

    return (
        <button 
            onClick={handleDownload} 
            className="control-button download-button"
            title="Download trimmed audio"
        >
            <BsDownload />
        </button>
    );
};

export default Download;
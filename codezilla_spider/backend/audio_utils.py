"""
Audio utilities using cloud-friendly alternatives to pyaudio
"""
import asyncio
import logging
import numpy as np
from typing import Optional, List, Tuple
import webrtcvad
import sounddevice as sd
from scipy import signal
import speech_recognition as sr

logger = logging.getLogger(__name__)

class CloudAudioRecorder:
    """Audio recorder using sounddevice instead of pyaudio"""
    
    def __init__(self, sample_rate: int = 16000, channels: int = 1):
        self.sample_rate = sample_rate
        self.channels = channels
        self.vad = webrtcvad.Vad(2)  # Aggressiveness level 2
        self.recording = False
        self.audio_buffer = []
        
    def start_recording(self):
        """Start recording audio"""
        try:
            self.recording = True
            self.audio_buffer = []
            
            def callback(indata, frames, time, status):
                if status:
                    logger.warning(f"Audio callback status: {status}")
                if self.recording:
                    # Convert to int16 for VAD
                    audio_int16 = (indata * 32767).astype(np.int16)
                    self.audio_buffer.extend(audio_int16.flatten())
            
            with sd.InputStream(
                samplerate=self.sample_rate,
                channels=self.channels,
                dtype=np.float32,
                callback=callback
            ):
                logger.info("Audio recording started")
                while self.recording:
                    asyncio.sleep(0.1)
                    
        except Exception as e:
            logger.error(f"Error starting audio recording: {e}")
            self.recording = False
    
    def stop_recording(self) -> Optional[np.ndarray]:
        """Stop recording and return audio data"""
        self.recording = False
        if self.audio_buffer:
            return np.array(self.audio_buffer, dtype=np.int16)
        return None
    
    def detect_voice_activity(self, audio_data: np.ndarray) -> bool:
        """Detect voice activity using webrtcvad"""
        try:
            # Convert to bytes for webrtcvad
            audio_bytes = audio_data.tobytes()
            # Check in 30ms chunks (480 samples at 16kHz)
            chunk_size = int(0.03 * self.sample_rate) * 2  # 2 bytes per sample
            
            for i in range(0, len(audio_bytes), chunk_size):
                chunk = audio_bytes[i:i + chunk_size]
                if len(chunk) == chunk_size:
                    if self.vad.is_speech(chunk, self.sample_rate):
                        return True
            return False
        except Exception as e:
            logger.error(f"Error in voice activity detection: {e}")
            return False

class SpeechRecognizer:
    """Speech recognition using SpeechRecognition library"""
    
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = 4000
        self.recognizer.dynamic_energy_threshold = True
        
    def recognize_from_audio_data(self, audio_data: np.ndarray, sample_rate: int = 16000) -> Optional[str]:
        """Recognize speech from audio data"""
        try:
            # Convert numpy array to audio data format
            audio_bytes = audio_data.tobytes()
            audio_source = sr.AudioData(audio_bytes, sample_rate, 2)  # 2 bytes per sample
            
            # Try multiple recognition services
            try:
                # Try Google Speech Recognition (requires internet)
                text = self.recognizer.recognize_google(audio_source)
                return text
            except sr.UnknownValueError:
                logger.warning("Speech not recognized")
                return None
            except sr.RequestError as e:
                logger.error(f"Could not request results: {e}")
                return None
                
        except Exception as e:
            logger.error(f"Error in speech recognition: {e}")
            return None
    
    def recognize_from_microphone(self, timeout: int = 5) -> Optional[str]:
        """Recognize speech directly from microphone"""
        try:
            with sr.Microphone() as source:
                logger.info("Listening for speech...")
                audio = self.recognizer.listen(source, timeout=timeout)
                
            try:
                text = self.recognizer.recognize_google(audio)
                return text
            except sr.UnknownValueError:
                logger.warning("Speech not recognized")
                return None
            except sr.RequestError as e:
                logger.error(f"Could not request results: {e}")
                return None
                
        except Exception as e:
            logger.error(f"Error in microphone recognition: {e}")
            return None

# Utility functions
def process_audio_chunk(audio_chunk: np.ndarray, sample_rate: int = 16000) -> Tuple[bool, float]:
    """Process audio chunk and return voice activity and confidence"""
    try:
        # Simple energy-based voice activity detection
        energy = np.mean(np.abs(audio_chunk))
        threshold = 1000  # Adjust based on your needs
        
        is_speech = energy > threshold
        confidence = min(energy / threshold, 1.0) if is_speech else 0.0
        
        return is_speech, confidence
    except Exception as e:
        logger.error(f"Error processing audio chunk: {e}")
        return False, 0.0

def save_audio_file(audio_data: np.ndarray, filename: str, sample_rate: int = 16000):
    """Save audio data to file"""
    try:
        import wave
        with wave.open(filename, 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)  # 2 bytes per sample
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio_data.tobytes())
        logger.info(f"Audio saved to {filename}")
    except Exception as e:
        logger.error(f"Error saving audio file: {e}")

# Example usage
async def record_and_process_audio(duration: float = 5.0) -> Optional[str]:
    """Record audio for specified duration and return transcribed text"""
    try:
        recorder = CloudAudioRecorder()
        recognizer = SpeechRecognizer()
        
        # Start recording
        recording_task = asyncio.create_task(
            asyncio.to_thread(recorder.start_recording)
        )
        
        # Wait for duration
        await asyncio.sleep(duration)
        
        # Stop recording
        recorder.recording = False
        await recording_task
        
        # Get audio data
        audio_data = recorder.stop_recording()
        if audio_data is not None:
            # Transcribe
            text = recognizer.recognize_from_audio_data(audio_data)
            return text
            
    except Exception as e:
        logger.error(f"Error in audio recording and processing: {e}")
        return None

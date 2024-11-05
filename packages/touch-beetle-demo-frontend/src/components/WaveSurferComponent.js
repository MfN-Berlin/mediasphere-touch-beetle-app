import { Box } from "@mui/material"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js";

const WaveSurferComponent = forwardRef((props, ref) => {
    const { url, onAudioEnded, onAudioProgress,  autoplay, onPlayPause, onReady } = props;
    const container = useRef(null)
    const wavesurfer = useRef(null);
    const [ready, setReady] = useState(false)
    useEffect( () => {
        if( onReady ) onReady(ready)
    }, [ready, onReady])

    useEffect(() => {

        setReady(false);
        wavesurfer.current = WaveSurfer.create({
            container: container.current,
            height: 'auto'
        });

        const onReady = () => {
            setReady(true)
        }

        wavesurfer.current.on('ready', onReady)
        wavesurfer.current.load(url)

        window.wavesurfer = wavesurfer.current
        return () => wavesurfer.current.destroy();
    }, [url]);



    useEffect(() => {
        if (onAudioProgress) onAudioProgress(0)
        if (ready) {
            const onTimeUpdate = (p) => {
                if (onAudioProgress && wavesurfer.current.getDuration()) {
                    onAudioProgress(p / wavesurfer.current.getDuration())
                }
            }

            const onFinish = () => {
                if (onAudioEnded) onAudioEnded()
            }

            const onPlay = () => {
                if( onPlayPause ) onPlayPause(true)
            }

            const onPause = () => {
                if( onPlayPause ) onPlayPause(false)
            }

            wavesurfer.current.on('timeupdate', onTimeUpdate)
            wavesurfer.current.on('finish', onFinish)
            wavesurfer.current.on('play', onPlay)
            wavesurfer.current.on('pause', onPause)

           
            if (autoplay) {
                wavesurfer.current.seekTo(0);
                wavesurfer.current.play();
            } 

        }
    }, [onAudioEnded, onAudioProgress, autoplay, ready, onPlayPause])

    

    useImperativeHandle( ref, () => {
        if( ready ) return wavesurfer.current
    }, [ready])




    return <Box ref={container} sx={{ height: 48, cursor:'pointer' }}></Box>
})

export default WaveSurferComponent
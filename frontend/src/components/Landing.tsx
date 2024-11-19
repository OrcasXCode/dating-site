import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import { Room } from "./Room";
import favicon from "../assets/omegle.png"

export const Landing = () => {
    const [name, setName] = useState("");
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [joined, setJoined] = useState(false);

    const getCam = async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        // MediaStream
        const audioTrack = stream.getAudioTracks()[0]
        const videoTrack = stream.getVideoTracks()[0]
        setLocalAudioTrack(audioTrack);
        setlocalVideoTrack(videoTrack);
        if (!videoRef.current) {
            return;
        }
        videoRef.current.srcObject = new MediaStream([videoTrack])
        videoRef.current.play();
        // MediaStream
    }

    useEffect(() => {
        if (videoRef && videoRef.current) {
            getCam()
        }
    }, [videoRef]);

    if (!joined) {
            
    return <>
        <div className="h-screen w-screen">
            <div className="h-[100px] bg-[#fff5f7] flex justify-left items-center">
                <svg width="200" height="150">
                    <image href={favicon} width="200" height="150"></image>
                </svg>
            </div>
            <div className="flex flex-row h-[calc(100vh-100px)]">
                <div className="w-[50%] h-full border-r-4">   
                    <video className="h-full w-full object-cover" autoPlay ref={videoRef}></video>
                </div>
                <div className="w-[50%] h-full flex items-center  justify-center bg-[#DE5576]">
                    <button className="h-[80px] w-[350px] bg-slate-200 rounded-full text-2xl font-semibold" onClick={() => {
                        setJoined(true);
                    }}>Start Video Chat</button>
                </div>
            </div>
        </div>
        </>
    }

    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}
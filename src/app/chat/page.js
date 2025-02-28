'use client'
import {React,useState,useEffect,useRef,Suspense} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AssistantIcon from '@mui/icons-material/Assistant';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { createClient } from '@supabase/supabase-js';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';
import { motion } from 'framer-motion';

let url = "https://dlrehwydsvuxrpesaemj.supabase.co"
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"

const supabase = createClient(url,key);

const style = {
  position: 'absolute',
  top: isMobile ? '10%' : '20%',
  left: isMobile ? '5%' : '70%',
  height: isMobile ? '70vh' : 500,
  width: isMobile ? '90vw' : 400,
  borderRadius: "1rem",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: "black"
};

const responsiveButtonStyle = {
    color: "white",
    fontSize: isMobile ? "1.5rem" : "2rem",
    zIndex: 10,
    minWidth: 'unset',
    padding: isMobile ? "8px" : "12px",
}

const buttonContainerStyle = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
}

function PageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [videoUrl, setVideoUrl] = useState([]);
    const subdiv = useRef(null);
    const [observers, setObservers] = useState([]);
    const [removedVideo, setRemovedVideo] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isAuth,setIsAuth] = useState(false);
    const [removedVideoID,setRemovedVideoID] = useState([]);

    async function getVideo() {
      try {
          const { data, error } = await supabase.storage.from('Reels').list('Public');
          if (error) {
              console.error('Error fetching video:', error);
              return;
          }
          if (data.length === 0) {
            console.log('No files found in bucket');
            return;
          }

          const filesWithUrls = data.map(file => {
            const { data: { publicUrl } } = supabase.storage
              .from('Reels')
              .getPublicUrl(`Public/${file.name}`);
            return { ...file, publicUrl };
          });

          // Fix: Show videos that are NOT in the removedVideo array
          setVideoUrl(filesWithUrls.filter((video) => {
            return !removedVideo.includes(video.id);
          }));
          console.log(videoUrl);
      } catch (error) {
          console.error('Error:', error);
      }
    }
    
    async function getRemovedVideos() {
        const { data: removedData, error } = await supabase.from('RemovedVideos').select('video_id');
        if (error) {
          console.log(error);
          return;
        }
      
        // Extract video_ids from the removed videos data
        const removedIds = removedData.map(item => item.video_id);
        setRemovedVideoID(removedIds);
      
        // Filter the videoUrl list to exclude removed videos
        const { data: videoData } = await supabase.storage.from('Reels').list('Public');
        if (videoData) {
          const filesWithUrls = videoData
            .filter(file => !removedIds.includes(file.id)) // Filter out removed videos
            .map(file => {
              const { data: { publicUrl } } = supabase.storage
                .from('Reels')
                .getPublicUrl(`Public/${file.name}`);
              return { ...file, publicUrl };
            });
      
          setVideoUrl(filesWithUrls);
        }
      }
          // Modify handleVideoPlayback to handle autoplay
    const handleVideoPlayback = async (video) => {
        try {
            // Pause all other videos
            const videos = document.querySelectorAll('.reel');
            await Promise.all(
                Array.from(videos).map(async (v) => {
                    if (v !== video) {
                        await v.pause();
                        v.currentTime = 0;
                    }
                })
            );
            
            // Play the target video if it exists and isn't already playing
            if (video && video.paused) {
                await video.play();
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Playback error:", error);
            }
        }
    };

    const handleRemove = async() => {
        // Get the active video from state
        const {data,error} = await supabase.from('RemovedVideos').insert({
            video_id:activeVideoId
        });
        if(error){
            console.log(error);
        }else{
            console.log("Video removed successfully");
            console.log(data);
        }
        const activeVideo = videoUrl.find(v => v.id === activeVideoId);
        
        console.log('Remove attempt:', {
            activeVideoId,
            activeVideo,
            currentIndex: currentReelIndex,
            allVideos: videoUrl.map(v => v.id)
        });

        if (!activeVideo) return;

        // Disconnect observers
        observers.forEach(obs => obs.disconnect());
        
        // Remove the active video
        const newVideoArray = videoUrl.filter(v => v.id !== activeVideoId);
        
        // Update states
        setVideoUrl(newVideoArray);
        setRemovedVideo(prev => [...prev, activeVideoId]);
        
        // Update index
        const newIndex = Math.max(0, currentReelIndex - 1);
        setCurrentReelIndex(newIndex);

        // Clear active video
        setActiveVideoId(null);
    };

    // Scroll to specific reel
    const scrollToReel = (index) => {
        if (index >= 0 && index < videoUrl.length && !isScrolling) {
            setIsScrolling(true);
            const videos = document.querySelectorAll('.reel');
            const targetVideo = videos[index];
            
            if (targetVideo && subdiv.current) {
                subdiv.current.scrollTo({
                    top: targetVideo.offsetTop,
                    behavior: 'smooth'
                });
                
                handleVideoPlayback(targetVideo);
                setCurrentReelIndex(index);
                // console.log(index);
                setTimeout(() => {
                    setIsScrolling(false);
                }, 1000);
            }
        }
    };

    
    
    useEffect(() => {
        const isAuthParam = searchParams.get('isAuth');
        if (isAuthParam !== 'true') {
            router.push('/'); // Redirect to login if not authenticated
            return;
        }

        setIsAuth(true);
        getVideo(); // Fetch videos if isAuth is true
        getRemovedVideos();
    }, [searchParams,router]); 



    useEffect(() => {
        // Create a wrapper function that returns false to prevent default scrolling
        const handleWheelEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!isScrolling) {
                if (e.deltaY > 0) {
                    scrollToReel(currentReelIndex + 1);
                } else {
                    scrollToReel(currentReelIndex - 1);
                }
            }
            return false;
        };

        const subdivElement = subdiv.current;
        if (subdivElement) {
            // Add both wheel and mousewheel events with non-passive option
            subdivElement.addEventListener('wheel', handleWheelEvent, { passive: false });
            subdivElement.addEventListener('mousewheel', handleWheelEvent, { passive: false });
            subdivElement.addEventListener('DOMMouseScroll', handleWheelEvent, { passive: false });
        }
        
        // Setup Intersection Observer
        const options = {
            root: subdiv.current,
            threshold: 0.7 // 70% of the video must be visible
        };

        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    handleVideoPlayback(video);
                    
                    // Find the video in our array
                    const videoSrc = video.querySelector('source').src;
                    const activeVideo = videoUrl.find(v => v.publicUrl === videoSrc);
                    if (activeVideo) {
                        setActiveVideoId(activeVideo.id);
                        const index = videoUrl.findIndex(v => v.id === activeVideo.id);
                        setCurrentReelIndex(index);
                    }
                }
            });
        };

        // Create observer and observe all videos
        const observer = new IntersectionObserver(callback, options);
        const videos = document.querySelectorAll('.reel');
        videos.forEach(video => observer.observe(video));

        // Store observer for cleanup
        setObservers(prev => [...prev, observer]);

        // Cleanup
        return () => {
            observers.forEach(obs => obs.disconnect());
            if (subdivElement) {
                subdivElement.removeEventListener('wheel', handleWheelEvent);
                subdivElement.removeEventListener('mousewheel', handleWheelEvent);
                subdivElement.removeEventListener('DOMMouseScroll', handleWheelEvent);
            }
        };
    }, [videoUrl.length, currentReelIndex, isScrolling, removedVideo]);

    return (
        (isAuth ?
            <div>
                <div>
                    <div className="Main">
                        <div className="subdiv" ref={subdiv}>
                            {videoUrl.map((file, index) => (
                                <motion.div 
                                    key={file.id}
                                    className="reel-container"
                                    whileTap={{ scale: 0.98 }}
                                    drag={isMobile ? "y" : false}
                                    dragConstraints={{ top: 0, bottom: 0 }}
                                >
                                    <video 
                                        className="reel"
                                        loop
                                        playsInline
                                        muted
                                        onPlay={() => setActiveVideoId(file.id)}
                                    >
                                        <source src={file.publicUrl} type="video/mp4" />
                                    </video>
                                    
                                    <Box sx={buttonContainerStyle}>
                                        <Button 
                                            sx={responsiveButtonStyle}
                                            onClick={handleOpen}
                                        >
                                            <AssistantIcon sx={{
                                                fontSize: isMobile ? "2.5rem" : "4rem"
                                            }}/>
                                        </Button>
                                        
                                        <Button
                                            sx={responsiveButtonStyle}
                                            onClick={() => {/* Add share handler */}}
                                            disableRipple
                                        >
                                            <i className="fa-regular fa-share-from-square" 
                                               style={{
                                                   color: "white",
                                                   fontSize: isMobile ? "2rem" : "2.8rem"
                                               }}
                                            />
                                        </Button>
                                        
                                        <Button
                                            sx={responsiveButtonStyle}
                                            onClick={() => {/* Add comment handler */}}
                                            disableRipple
                                        >
                                            <i className="fa-regular fa-comment-dots" 
                                               style={{
                                                   color: "white",
                                                   fontSize: isMobile ? "2rem" : "2.8rem"
                                               }}
                                            />
                                        </Button>
                                        
                                        <Button 
                                            sx={responsiveButtonStyle}
                                            onClick={handleRemove}
                                            disableRipple
                                        >
                                            <DeleteIcon sx={{
                                                fontSize: isMobile ? "2.5rem" : "3.5rem",
                                                color: "white"
                                            }}/>
                                        </Button>
                                    </Box>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        ...style,
                        width: isMobile ? '90vw' : 400,
                        height: isMobile ? '70vh' : 500,
                        left: isMobile ? '5%' : '70%',
                        top: isMobile ? '10%' : '20%',
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Groat Support <CloseIcon sx={{marginLeft:"10rem",fontSize:"2rem"}} onClick={handleClose}/>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Wait our representative will be connecting in while
                        </Typography>
                        <TextField
                            id="filled-multiline-static"
                            multiline
                            rows={1}
                            placeholder='What can i help you with?'
                            variant="filled"
                            sx={{width:"20rem",marginTop:35}}
                        />
                    </Box>
                </Modal>
            </div>
            :
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",fontSize:"2rem",color:"black"}}>
                No session found Please login/Signup again
            </div>
        )
    );
}

export default Page

function Page() {
    return (
        <Suspense>
            <PageContent />
        </Suspense>
    );
}

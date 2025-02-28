'use client'
import React, { useState, useEffect } from 'react'
import {Stack} from '@mui/material'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import {Box} from '@mui/material'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createClient } from '@supabase/supabase-js'

let url = "https://dlrehwydsvuxrpesaemj.supabase.co"
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"

const supabase = createClient(url,key);

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color:"black"
  };
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  
  
function page() {
    const [openCourse, setOpenCourse] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const handleOpenCourse = () => setOpenCourse(true);
    const handleCloseCourse = () => setOpenCourse(false);
    
    const handleOpenVideo = () => setOpenVideo(true);
    const handleCloseVideo = () => setOpenVideo(false);
    const handleUploadReel = async(categoryName) => {
        try {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'video/*'; // Accept video files only
            
            fileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Create a unique filename using timestamp
                const timestamp = new Date().getTime();
                const fileName = `${timestamp}_${file.name}`;
                const filePath = `${categoryName}/${fileName}`;

                // Upload the file
                const { data, error } = await supabase.storage
                    .from('Reels')
                    .upload(filePath, file);

                if (error) {
                    console.error('Error uploading file:', error.message);
                } else {
                    console.log('File uploaded successfully:', data);
                    // Optionally refresh the page or update UI
                    window.location.reload();
                }
            };

            // Trigger file input click
            fileInput.click();
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }
    const handleCreateCourseFolder = async() => {
        console.log("Create Course Folder");
        const courseName = document.getElementById("standard-search").value;
        const {data,error} = await supabase.storage.from('Reels').upload(`/${courseName}`,file);
        if(error){
            console.log(error);
        }
        else{
            console.log(data);
        }
    }
    useEffect(() => {
        const fetchCourses = async () => {
            const {data,error} = await supabase.storage.from('Reels').list()
            console.log(data);
            setCategories(data);
        }
        fetchCourses();
    },[])
    return (
        <div>
            <Box sx={{ flexGrow: 1, width:"80vw", height:"100vh", marginTop:"10vh", marginLeft:"10vw"}}>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <Item>
                            <Typography variant="h4">Add Course Folder</Typography>
                            <div>
                                <Button variant='contained' color='tertiary' onClick={handleOpenCourse}>Add Course</Button>
                                <Modal
                                    open={openCourse}
                                    onClose={handleCloseCourse}
                                    aria-labelledby="course-modal-title"
                                    aria-describedby="course-modal-description"
                                >
                                    <Box sx={style}>
                                    <Typography id="course-modal-title" variant="h6" component="h2">
                                        Please fill in desired course name
                                    </Typography>
                                    <TextField
                                        id="standard-search"
                                        label="Course Name"
                                        type="search"
                                        variant="standard"
                                    />
                                    <Button onClick={handleCreateCourseFolder} style={{height:"7vh",paddingTop:"1rem"}}>Create Folder</Button>
                                    </Box>
                                </Modal>
                            </div>
                        </Item>
                    </Grid>
                    <Grid size={3}>
                        <Item>
                            <Typography variant="h4">Add Video</Typography>
                            <div>
                                <Button variant='contained' color='tertiary' onClick={handleOpenVideo}>Add Reels</Button>
                                <Modal
                                    open={openVideo}
                                    onClose={handleCloseVideo}
                                    aria-labelledby="video-modal-title"
                                    aria-describedby="video-modal-description"
                                >
                                    <Box sx={style}>
                                    <Typography id="video-modal-title" variant="h6" component="h2">
                                        Choose Category
                                    </Typography>
                                        <Grid sx={{flexDirection:"column",display:"flex"}} container spacing={2}>
                                            {categories.map((category,index) => (
                                            <Grid  size={{  md: 12}} key={index}>
                                                <Item sx={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"row",gap:"1rem"}}>
                                                    <Typography variant="h5">{index+1}.</Typography>
                                                    <Typography variant="h5">{category.name}</Typography>
                                                    <Button
                                                        onClick={() => handleUploadReel(category.name)}
                                                        component="label"
                                                        role={undefined}
                                                        variant="contained"
                                                        tabIndex={-1}
                                                        startIcon={<CloudUploadIcon />}
                                                        style={{justifyContent:"flex-end",display:"flex",marginLeft:"auto"}}
                                                    >
                                                        Upload Reel
                                                    </Button>
                                                </Item>
                                            </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Modal>
                            </div>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default page
//////////////////////////////
// Edit Profile Photo Modal
//////////////////////////////

// libraries
import { useRef, useState } from "react";

// import media
import SelectPhoto from '../assets/select_photo.png'
import { supabase } from "../lib/supabaseClient";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";



const EditProfilePhoto = (props) => {

    const logged_user = useSelector(state => state.user.user)

    const [newImage, setNewImage] = useState(null)
    const [oldImage, setOldImage] = useState(props.profile_photo ? props.profile_photo : null)

    const hiddenFileInput = useRef(null);
      
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const imgname = file.name;
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onloadend = async () => {
            const img = new Image();
            img.src = reader.result;
        
            img.onload = async () => {
            const maxSize = Math.max(img.width, img.height);
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = maxSize;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, (maxSize - img.width) / 2, (maxSize - img.height) / 2);
        
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, "image/jpeg", 0.8);
            });
        
            const newFile = new File([blob], imgname, {
                type: "image/png",
                lastModified: Date.now(),
            });
        
            setNewImage(newFile);
            };
        };
    };
    
    const uploadNewProfilePhoto = async (user_id, new_photo) => {
        if(props.profile_photo !== null){
            const {e} = await supabase.storage.from('profile_photos').upload(`${user_id}/profile0`, new_photo, {
                cacheControl: 3600,
                upsert: true
            })
            if(e){
                toast.warning(e, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }else{
                toast.success('Profile updated Successfully! 🎊', {
                    position: toast.POSITION.BOTTOM_LEFT
                })
                setTimeout(()=>{
                    window.location.reload()
                }, 2000)
            }
        }
    };

    const updateProfilePhoto = async (user_id, new_photo) => {
        if(user_id === logged_user.id){
            let filenameNumber = props.profile_photo.split(`${logged_user.id}/profile`)[1]
            let filepath = String(`${user_id}/profile${filenameNumber}`);
            try {
                const {data, error} = await supabase.storage.from('profile_photos').remove([filepath])
                if(data){
                    // modifying file path on Database so the change is automatically
                    if(filenameNumber === '0'){filenameNumber='1'}
                    else if(filenameNumber==='1'){filenameNumber = '2'}
                    else if(filenameNumber==='2'){filenameNumber = '3'}
                    else if(filenameNumber==='3'){filenameNumber = '0'}
                    console.log(filenameNumber);
                    const {e} = await supabase.storage.from('profile_photos').upload(`${user_id}/profile${filenameNumber}`, new_photo, {
                        cacheControl: 3600,
                        upsert: true
                    })
                    if(e){
                        toast.warning(e, {
                            position: toast.POSITION.TOP_RIGHT
                        })
                    }else{
                        console.log(filenameNumber);
                        toast.success('Profile updated Successfully! 🎊', {
                            position: toast.POSITION.BOTTOM_LEFT
                        })
                        setTimeout(()=>{
                            window.location.reload()
                        }, 2000)
                    }
                }
                if(error){
                    console.log(error);
                }
                
            } catch (error) {
                console.log(error);   
            }
        }
        else{
            console.log("Permission Denied!");
        }
    };
    
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };
    
    return(
        <div className="image-upload-container">
            <div className="close-top">
                <a onClick={props.closeModal}><i class="fa-solid fa-circle-xmark closeUploadModal"></i></a>
            </div>
            <div className="box-decoration">
                <label htmlFor="image-upload-input" className="image-upload-label">
                <i class="fa-solid fa-image"></i> Upload Profile Photo 
                </label>
                <div onClick={handleClick} className="imageBox">
                    {oldImage ? (
                        newImage ?
                        (<img src={URL.createObjectURL(newImage)} className="img-display" />):
                        (<img src={oldImage} className="img-display" />)
                        
                    ) : (
                        <img src={SelectPhoto} alt="upload image" className="img-display" />
                    )}
                </div>
                <input
                    id="image-upload-input"
                    type="file"
                    onChange={handleImageChange}
                    ref={hiddenFileInput}
                    accept="image/*"
                    style={{ display: "none" }}
                />

                <div className="uploadPicBtn-container">
                    <button className="image-upload-button" onClick={(e)=>{
                        e.preventDefault()
                        {props.profile_photo ? (updateProfilePhoto(logged_user.id, newImage)) : (uploadNewProfilePhoto(logged_user.id, newImage))}
                    }}>Upload Photo</button>
                </div>
            </div>
        </div>
    )
}


export default EditProfilePhoto
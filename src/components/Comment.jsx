/////////////////////
// Comment Component 
/////////////////////

// media
import avatar from '../assets/basedProfile.png'

// import all libraries
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../lib/supabaseClient'

// Delete Modal
import DeleteModal from '../modals/DeleteModal'


// About Page Template
function Comment(data) {
    const logged_user = useSelector(state => state.user.user)

    const [metadata, setMetaData] = useState(null)
    const [isAuthor, setIsAuthor] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [profile_photo, setProfilePhoto] = useState(null)

    const getUserMetaData = async (user_id) => {
        try {
            const {data, e} = await supabase.from('users_data').select().eq('user_id', user_id)
            if(data){
                setMetaData(data[0])
            }
            if(e){
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const checkifIsAuthor = async () => {
        if(data.data.user_id === logged_user.id){
            setIsAuthor(true)
        }
    }

    const deleteComment = async () => {
        try {
            const {e} = await supabase.from('comments').delete().eq('id', data.data.id)
            if(e){
                console.log(e);
            }
            else{
                window.location.reload()
            }
        } catch (e) {
            console.log(e);
        }
    }

    const getProfilePhoto = async (profile_id) => {
        let { data: filename, error } = await supabase.storage.from('profile_photos').list(profile_id, {
            limit: 2,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })
        if(error){
            console.log(error);
        }
        if(filename){
            filename = filename[filename.length-1].name
            let filepath = `${profile_id}/${filename}`
            const {data} = supabase.storage.from('profile_photos').getPublicUrl(filepath)
            if(data){
                setProfilePhoto(data.publicUrl)
            }
        }
    }

    const calculateTimeDifference = (timePost) => {
        const startDate = new Date(timePost);
        const currentTime = new Date();
        const difference = currentTime.getTime() - startDate.getTime();
        
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days === 0) {
            if (hours === 0) {
                if (minutes === 0) {
                    if (seconds === 0) {
                        return 'Just now';
                    } else {
                        return `${seconds} ${seconds === 1 ? 'sec' : 'secs'} ago`;
                    }
                } else {
                    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
                }
            } else {
                return `${hours} ${hours === 1 ? 'hour' : 'hrs'} ago`;
            }
        } else if (days === 1) {
            return '1 day ago';
        } else {
            return `${days} days ago`;
        }
    };

    let time = calculateTimeDifference(data.data.created_at)

    function closeModal(){
        setModalOpen(false)
    }

    useEffect(() => {
        getUserMetaData(data.data.user_id)
        checkifIsAuthor()
        getProfilePhoto(data.data.user_id)
    }, [])

    if(metadata){
        return (
            <div className="comment">
                <div className="top">
                    <Link className='comment-link' to={'/profile/' + data.data.user_id} style={{textDecoration: 'none'}}>
                        <img className='avatar' src={profile_photo} onError={(e)=>{
                            e.target.src = avatar
                            e.onError = null
                        }}/>
                        <div className='info-comment'>
                            <h4 className='author'>{metadata.username}</h4>
                            <p className='time'>{time}</p>
                        </div>
                    </Link>
                    {isAuthor && <a onClick={() => setModalOpen(true)} className='dltComment'><i class="fa-solid fa-trash"></i></a>}
                </div>
                <div className="bottom">
                    <p>{data.data.body}</p>
                </div>
                { modalOpen && (
                    <DeleteModal
                        context='Are you sure you want to delete this comment?'
                        icon="fa-solid fa-triangle-exclamation"
                        closeModal={closeModal}
                        deleteFunction={deleteComment}
                    ></DeleteModal>
                )}
            </div>
        )
    }
}

export default Comment;
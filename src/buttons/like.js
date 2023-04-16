import {useState} from 'react';
import API from '../utils/backend.js'
import Heart from "react-heart";
import './like.css'
const api = new API();
const footColor = '#b7afaf'

const LikeButton = (LikedByUsed, LikeCount, postID) => {
  // Bookmark button and functionalities
  const [liked, setLike] = useState(LikedByUsed);
  const [likeCount, setLikeCount] = useState(LikeCount);

  function handleLikeClick(){
    // updates like state
    const likeState = !liked;

    api.post('/actions/like/', 
      { id: postID, value:likeState})

    setLikeCount(likeState?(likeCount+1):(likeCount-1));
    setLike(likeState);
  }

  return (
    <div className="likeSection">
      <span className='like-button'>
        <Heart  inactiveColor={footColor}
                isActive={liked}
                onClick={() => handleLikeClick() }/>
      </span>
      <span className='likeCounter'>{likeCount}</span>

    </div>
  );
}

export default LikeButton;
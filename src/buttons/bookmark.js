import {useState} from 'react';
import API from '../utils/backend.js'
import './bookmark.css'
const api = new API();

function makeId(){
  let ID = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for ( var i = 0; i < 12; i++ ) {
    ID += characters.charAt(Math.floor(Math.random() * 36));
  }
  return ID;
}


const Bookmark = (bookmarked, postId) => {
  // Bookmark button and functionalities
  const [Bookmarked, setBookmarked] = useState(bookmarked);
  const id = makeId();

  function updateBookmark(value){
    // updates visual bookmark    
    const bookmarkIcon = document.getElementById('bookmark'+id);
    if(value){
      bookmarkIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 700,'GRAD' 0,'opsz' 40"
    } else {
      bookmarkIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 100,'GRAD' 100,'opsz' 40"
    } 
  }

  function handleBookmark(){
    const bookmarkState = !Bookmarked;
    api.post('/posts/bookmark/', { id: postId, value:bookmarkState})
    setBookmarked(bookmarkState);
    updateBookmark(bookmarkState);
  }

  return (
    <span 
      id={'bookmark'+id}
      onClick={()=> handleBookmark() }
      className="material-symbols-outlined bookmark-icon">
        bookmark
    </span>
  );
}


export default Bookmark;
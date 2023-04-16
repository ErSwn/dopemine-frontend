import React from 'react';
import {useState, useEffect} from 'react';
import {API_URL} from '../utils/backend.js';
import API from '../utils/backend.js'

import InfiniteScroll from 'react-infinite-scroll-component'
import "react-carousel-responsive/dist/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Heart from "react-heart";

import Bookmark from '../buttons/bookmark.js'
import LikeButton from '../buttons/like.js'
import parseDate from '../utils/parseDate.js'
import randomId from '../utils/randomId.js'
import {Link} from 'react-router-dom';

import CommentSection  from './commentSection.js'
import './publication.css'
const api = new API();


const GalleryRender = (gallery) =>{
  if (Object.keys(gallery).length === 0){
    return <div></div>

  } else if (Object.keys(gallery).length > 1) {

    return<div className='publication-media'>
      <Carousel preventMovementUntilSwipeScrollTolerance={true} swipeScrollTolerance={50} className='post-Carousel' showThumbs={false} useKeyboardArrows={true}>    
        { Object.keys(gallery).map((key_) =>{
              return (<div className="slide">
                <img alt ="" className="publication-image" src={API_URL +"/image/"+gallery[key_]} />
              </div>
              )})
          }
      </Carousel>
      </div>

  } else {

    return<div className='publication-media'> 
    
    <img alt ="" className="publication-image" src={API_URL +"/image/"+gallery[Object.keys(gallery)[0]]} />

    </div>
  }
}

function Publication({post}){
  const [showComments, setCommentSectionDisplay] = useState(false);
  const displayedDate = parseDate(post.date_of_publication);
  function handleCommentSection(){
    setCommentSectionDisplay(!showComments);
  }

  // return <p>as hola {displayedDate} {Bookmark(false, post.id)} {LikeButton(post)}</p>
  return(
      <div className='post'>
        <div className='post-container'>
        <Link to={"/"+post.username}>
         <div className='user-profile-photo'>
             <img alt="" className="publication-image" src={API_URL +"/profile/media/"+post.username} />
         </div>
        </Link>
        <div className='publication-content-container'>
          <div className='publication-header' >
            <span className='user-name'>{post.full_name}</span>
            <span className='user-username'>@{post.username} </span>
          </div>
          <div className='publication-content'>
            <div className='publication-label'>{post.content}</div> 
          </div>
        </div>
      {GalleryRender(post.media)}
        <div className='publication-foot prevent-select'>
          {LikeButton(post.liked, post.like_count, post.id)}
          <span onClick={()=> handleCommentSection() } className="material-symbols-rounded comment-icon">
          mode_comment
          </span>
          <span  className="comment-counter">
            {post.comment_count}
          </span>
          {Bookmark(post.bookmark, post.id)}
          <span className='publication-date'>
           {displayedDate}
          </span>
        </div>
        {showComments &&
        <CommentSection
          post_id = {post.id}
        ></CommentSection>}


        </div>
      </div>)
}

// class Publication extends React.Component {
//    constructor() {
//     super()
//     this.id = randomId()
// 
//     this.state = {
//      liked:false,
//      like_count:0,
//      date_of_publication:"",
//      display_comments:false,
//      comment_counter:0,
//      bookmark:false,   
//    }
//     
//  }
//   componentDidMount() {
//   var dt = new Date(this.props.post.date_of_publication)
// 
//   const year = dt.getFullYear();
//   const month = getMonthName(dt.getMonth()+1)
//   const day = dt.getDate();
//   const hour = dt.getHours();
//   const minute = dt.getMinutes();
// 
//   dt = [hour, minute].join(":") +"  - "+  [day, month, year].join(" ")
// 
//   this.setState({ like_count:this.props.post.like_count,
//                   liked:this.props.post.liked_by_user,
//                   date_of_publication:dt,
//                   bookmark:this.props.post.bookmark
//      });
// 
//   this.updateBookmark(this.props.post.bookmark);  
// }
// 
//   displayComments(){
//     this.setState({ display_comments:!this.state.display_comments });
//   }
// 
//   updateBookmark(value){
//     const bookmarkIcon = document.getElementById('bookmark'+this.id);
//     if(value){
//       bookmarkIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 700,'GRAD' 0,'opsz' 40"
//     } else {
//       bookmarkIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 100,'GRAD' 100,'opsz' 40"
//     }
//   }
//   async handleBookmarkClick(){
//     const bookmarkState = !this.state.bookmark;
//     api.post('/posts/bookmark/', 
//       { id: this.props.post.id, value:bookmarkState})
//     this.setState({ bookmark:bookmarkState})
//     this.updateBookmark(bookmarkState)
//   }
// 
//   async handleLikeClick() {
//     // updates like state
//     var like_state = !this.state.liked;
//     api.post('/actions/like/', 
//       { id: this.props.post.id, value:like_state})
// 
//     this.setState({ liked:like_state });
// 
//     // updates like counter
//     var like_count = this.state.like_count;
// 
//     if(like_state){
//       like_count = like_count+1
//     } else {
//       like_count = like_count-1
//     }
// 
//     this.setState({ like_count:like_count });
//   }
// 
//   doubleTap(event) {
//     console.log('double tap');
//   }
//   render() {
//       
//     )}
// }
// 

export default Publication;
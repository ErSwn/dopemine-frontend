import * as React from 'react';
import {useId} from 'react';
import axios from 'axios';
import './App.css';
import API from './components/backend.js';
import {API_URL} from './components/backend.js';

import InfiniteScroll from 'react-infinite-scroll-component'
import "react-carousel-responsive/dist/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Heart from "react-heart";

import { useDoubleTap } from 'use-double-tap';



// import Swipe from 'swipejs';
const API_conection = new API();
var user = '123'

function makeId(){
  let ID = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for ( var i = 0; i < 12; i++ ) {
    ID += characters.charAt(Math.floor(Math.random() * 36));
  }
  return ID;
}

class Comment extends React.Component {
  constructor(){
    super()
    this.setState = {
      liked:false
    }
  }

  render() {
    return <div className='comment'>
      <div className='comment-photo-container'>
        <div className='comment-profile-photo' >
          <img alt="" className="publication-image-profile-photo" src={API_URL +"/profile/media/"+this.props.content.username} />
        
        </div>
      </div>
      <div className='comment-content'>
        <div className='comment-header'>
          <div className='comment-name'>{this.props.content.full_name}</div>
          <div className='comment-username'>@{this.props.content.username}</div>
        </div>
        <div className='comment-label'>
          {this.props.content.content}
        </div>
      </div>
      <div className='comment-foot'></div>
    </div>
  }
}

class CommentSection extends React.Component {
   constructor() {
      super()
      this.state = {
         content:'',
         id:makeId(),
         comments:[],
         pagination_counter:0,
         hasMore:true,
         load_more_id:makeId()
      }
   }
   update_paginations(){
    this.setState({pagination_counter: this.state.pagination_counter + 1 }) 
  }

  componentDidMount() {
    this.fetchData()
  }
  
  fetchData = () =>  {
    try {
      const lenght = this.state.comments.length;
      
      
      API_conection.get(
        '/api/comment/'
        ,{
          params: {
            post_id:this.props.post_id,
            pagination: this.state.pagination_counter,
          }})
      .then(response => response.data )
      .then(data => {
        if (data.lenght === 0){
          this.setState({ hasMore: false })
          console.log(this.state.hasMore)
        } else {
          this.update_paginations();
          this.setState({ comments: [...this.state.comments, ...data] })
        }
      })
    } catch (e) {
      console.log(e);
    }
  }

  async uploadComment() {
    const content = document.getElementById(this.state.id).innerHTML;
    console.log(content)
    API_conection.post(
      "/actions/comment/", 
      {
        content:content,
        post_id:this.props.post_id}
      )
  }
  render() {
      return <div className='publication-comments'>
          <div className='comment-title'>Comentarios</div>
            <div className='comment-form'>
              <div className='comment-form-photo'>
          <img alt="" className="publication-image-profile-photo" src={API_URL +"/p/profilephoto"} />

              </div>
              <div className='comment-input-container'>

                <p><span id={this.state.id} className="textarea" role="textbox" contentEditable="true"></span></p>
                {/* <textarea elastic id={this.state.id} type="text" className="comment-input"/> */}
                <button  className='comment-submit-button' onClick={() => this.uploadComment() }></button>
              </div>
            </div>
            <div className='comment-section'>
              <InfiniteScroll
               dataLength={this.state.comments.length}
               hasMore={this.state.hasMore}
               // loader={this.state.hasMore?<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>:<div>asd</div>}

               >
               {this.state.comments.map((comment) => (

                <div key={comment.id} className="comments-container">
                  <Comment content={comment}></Comment>
                
                </div>
               ))}
            </InfiniteScroll>
            <span id={this.state.load_more_id} onClick={() => this.fetchData()} className='comment-load-more'>{this.state.hasMore?<p>Cargar más...</p>:<p></p>}</span>
          </div>
        </div>
    }
  }
const footColor = '#b7afaf'


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

class Publication extends React.Component {
   constructor() {
    super()
    this.id = makeId()

    this.state = {
     liked:false,
     like_count:0,
     date_of_publication:"",
     display_comments:false,
     comment_counter:0,
     bookmark:false,
      
   }
    
 }




  componentDidMount() {
  var dt = new Date(this.props.post.date_of_publication)

  const year = dt.getFullYear();
  const month = dt.getMonth()+1
  const day = dt.getDate();
  const hour = dt.getHours();
  const minute = dt.getMinutes();

  dt = [year, month, day].join("/") +"  "+ [hour, minute].join(":")

  this.setState({ like_count:this.props.post.like_count });
  this.setState({ liked:this.props.post.liked_by_user });
  this.setState({ date_of_publication:dt });
  this.setState({ bookmark:this.props.post.bookmark})
  this.updateBookmark(this.props.post.bookmark);  
}

  displayComments(){
    this.setState({ display_comments:!this.state.display_comments });
  }

  updateBookmark(value){
    const bookmarkIcon = document.getElementById('bookmark'+this.id);
    if(value){
      bookmarkIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 700,'GRAD' 0,'opsz' 40"
    } else {
      bookmarkIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 100,'GRAD' 100,'opsz' 40"
    }
  }
  async handleBookmarkClick(){
    const bookmarkState = !this.state.bookmark;
    console.log(bookmarkState)
    API_conection.post('/posts/bookmark/', 
      { id: this.props.post.id, value:bookmarkState})
    this.setState({ bookmark:bookmarkState})
    this.updateBookmark(bookmarkState)
  }

  async handleLikeClick() {
    // updates like state
    var like_state = !this.state.liked;
    API_conection.post('/actions/like/', 
      { id: this.props.post.id, value:like_state})

    this.setState({ liked:like_state });

    // updates like counter
    var like_count = this.state.like_count;

    if(like_state){
      like_count = like_count+1
    } else {
      like_count = like_count-1
    }

    this.setState({ like_count:like_count });
  }

  doubleTap(event) {
    console.log('double tap');
  }
  render() {
      return(
      <div className='post'>
        <div className='post-container'>
          <a href={API_URL+"/"+this.props.post.username}>
        <div className='user-profile-photo'>
          <img alt="" className="publication-image" src={API_URL +"/profile/media/"+this.props.post.username} />
        </div>
          </a>
        
        <div className='publication-content-container'>
          <div className='publication-header' >
            <span className='user-name'>
              {this.props.post.full_name}
            </span>
            <span className='user-username'>
              @{this.props.post.username} 
            </span>
          </div>
          <div {...this.bind} className='publication-content'>
            <div className='publication-label'>
              {this.props.post.content}
            </div> 
          </div>
        </div>
      {GalleryRender(this.props.post.media)}
        <div className='publication-foot prevent-select'>
          <span className='like-button'>
            <Heart inactiveColor={footColor}  isActive={this.state.liked} onClick={() => this.handleLikeClick() }/>
          </span>
          <span  className="likeCounter">
              {this.state.like_count}
          </span>
          <span onClick={()=> this.displayComments() } className="material-symbols-rounded comment-icon">
          mode_comment
          </span>
          <span  className="comment-counter">
            {this.props.post.comment_count}
            </span>
            <span 
              id={'bookmark'+this.id}
              onClick={()=> this.handleBookmarkClick() }
              class="material-symbols-outlined">
              bookmark
            </span>

          <span className='date'>
          {this.state.date_of_publication}
          </span>

        </div>


        {this.state.display_comments &&
        <CommentSection
          post_id = {this.props.post.id}
        ></CommentSection>}


        </div>
      </div>
    )}
}

class App extends React.Component {
 constructor() {
  super()
  this.state = {
   items: [],
   hasMore: true,
   following: [],
   pagination_counter:0
 }
}


  update_paginations = () =>{
    this.setState({pagination_counter: this.state.pagination_counter + 1 })
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () =>  {
    try {
      if(!this.state.hasMore){
        return false;
      }
      axios.get(API_URL+'/api/todos/', {
       params: {
        user:'123',
        pagination: this.state.pagination_counter,
      },
    })
      .then(reponse   => reponse.data)
      .then(newItems  => {
        if (newItems.length === 0){
          this.setState({ hasMore: false })
        } else{
          this.update_paginations()
          this.setState({ items: [...this.state.items, ...newItems] })
        }
    }
        );

    } catch (e) {
      console.log(e);
    }
  }

  render() {
      return (
         <div onScroll={() =>{console.log('scrolll')}} className="publications-container">
            <InfiniteScroll
               dataLength={this.state.items.length}
               next={this.fetchData}
               loader={<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
               hasMore={this.state.hasMore}>
               {this.state.items.map((post) => (
                <article key={post.id} className="post-container">
                  <Publication post={post}></Publication>
                </article>
               ))}
            </InfiniteScroll>
         </div>
      )
   }
}
  
export default App

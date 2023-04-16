import React from 'react';
import {useState, useEffect} from 'react';
import {API_URL} from '../utils/backend.js';

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
import API from '../utils/api.js';

const api = new API();

function Comment(comment){
  // const [liked, setLiked] = useState(false);

  return (
    <div className='comment'>
      <div className='comment-photo-container'>
        <div className='comment-profile-photo' >
          <img alt="" className="publication-image-profile-photo" src={API_URL +"/profile/media/"+comment.username} />
        </div>
      </div>
      <div className='comment-content'>
        <div className='comment-header'>
          <div className='comment-name'>{comment.full_name}</div>
          <div className='comment-username'>@{comment.username}</div>
        </div>
        <div className='comment-label'>
          {comment.content}
        </div>
      </div>
      <div className='comment-foot'></div>
    </div>
  );
}


class CommentSection extends React.Component {
   constructor() {
      super()
      this.state = {
         content:'',
         id:randomId(),
         comments:[],
         pagination_counter:0,
         hasMore:true,
         load_more_id:randomId()
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
      
      
      api.get(
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
    api.post(
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
                  {Comment(comment)}                
                </div>
               ))}
            </InfiniteScroll>
            <span id={this.state.load_more_id} onClick={() => this.fetchData()} className='comment-load-more'>{this.state.hasMore?<p>Cargar más...</p>:<p></p>}</span>
          </div>
        </div>
    }
  }


export default CommentSection;
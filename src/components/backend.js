import {setState} from 'react';
import axios from 'axios';
export const API_URL = 'http://localhost:8000';
// export const API_URL = 'http://192.168.1.111:8000';

// export const API_URL = '';
var csrfToken = '';
 axios.get(API_URL+'/security/gettoken/', {})
  .then(response =>{
    csrfToken =  response.data['csrftoken']
    document.cookie = 'csrftoken='+csrfToken+';'
})


class API {
  constructor(props){
    this.state = {
      token:'',
      baseURL:'',
      media_URL:'',
      verifiedCSRF:false
    }

  }

  gettoken = () => {
    return this.__get__('/security/gettoken/', {})
      .then(response =>{})
      .catch((e) => {
        console.log(e)
      })
  }

  checkToken = () =>{
      return true
  }
  async __get__(url, parameters){
    return await axios.get(API_URL+url, parameters)
  }
  async __post__(url, parameters){
      return await fetch(API_URL+url,
        {
          credentials:'include',
          method:'POST',
          headers:{ 'X-CSRFToken':csrfToken },
          body:JSON.stringify({
            data:parameters,
            csrfmiddlewaretoken:csrfToken
          })})

    }
    async get(url, parameters){
      return this.__get__(url, parameters);
    return await this.checkToken().then(() => {
      return this.__get__(url, parameters);
    })
  }
  async post(url, parameters){
    return this.__post__(url, parameters);
    return await this.checkToken().then(() => {
      return this.__post__(url, parameters);
    })
  }
}

export default API;

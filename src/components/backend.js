import axios from 'axios';
export const API_URL = 'http://localhost:8000';

export function getCookie(name) {
  if (!document.cookie) {
    return null;
  }
  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));

  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}

class API {
  constructor(props){
    this.token = '';
    this.baseURL = API_URL;
    this.media_URL = this.baseURL;
    this.csrfToken = getCookie('csrftoken');
    this.verifiedCSRF = false;
  }

  async gettoken ()  {
    return await this.__get__('/security/gettoken/', {
      method: 'GET'
    }).then(response =>{
      document.cookie = "csrftoken="+response.data['csrfToken']})
  }

  async checkToken(){
    if (this.verifiedCSRF){
      return true
    } else {
      return await this.__post__('/api/checkcsrf')
      .then(response => {
          this.verifiedCSRF  = true
        }).catch((e) => {
          console.log(e)
          return  this.gettoken().then(() => {
            this.instance.defaults.headers['X-CSRFToken'] = getCookie('csrftoken')
          })
        })
      }

    }
    async __get__(url, parameters){
      // parameters['csrfmiddlewaretoken'] = this.csrfToken;
      return await axios.get(API_URL+url, parameters)
    }
    async __post__(url, parameters){
      // parameters['csrfmiddlewaretoken'] = this.csrfToken;
      return await fetch(API_URL+url,
        {
          credentials:'include',
          method:'POST',
          headers:{ 'X-CSRFToken':getCookie('csrftoken') },
          body:JSON.stringify(parameters)})
      return await this.instance.post(url, parameters);

    }

    async get(url, parameters){
    return await this.checkToken().then(() => {
      return this.__get__(url, parameters);
    })
  }
  async post(url, parameters){
    return await this.checkToken().then(() => {
      return this.__post__(url, parameters);
    })
  }
}

export default API;

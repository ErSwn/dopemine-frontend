import axios from 'axios';

export const API_URL = 'http://localhost:8000';
// export const API_URL = '';

// const test_URL = API_URL + 'check/test';

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

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 5000,
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken':this.csrfToken
      }
    })
  }

  async gettoken ()  {
    return await this.instance.get('security/gettoken/', {
      method: 'GET'
    }).then(response =>{
      document.cookie = "csrftoken="+response.data['csrfToken']})
  }

  async checkToken(){
    if (this.verifiedCSRF){
      return true
    } else {
      return await this.instance.post('api/checkcsrf')
      .then(response => {
          this.verifiedCSRF  = true
        }).catch(() => {
          return  this.gettoken().then(() => {
            console.log(getCookie('csrftoken'))
            this.instance.defaults.headers['X-CSRFToken'] = getCookie('csrftoken')
            console.log(this.instance.defaults.headers['X-CSRFToken'])
          })
        })
      }

    }
  async __get__(url, parameters){
    // parameters['csrfmiddlewaretoken'] = 
    return await this.instance.get(url, parameters);
  }
  async __post__(url, parameters){

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

import axios from 'axios';
export const API_URL = 'http://localhost:8000';
// export const API_URL = '';

// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             // Does this cookie string begin with the name we want?
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }
// 

function getCookie(name) { 
  var re = new RegExp(name + "=([^;]+)"); 
  var value = re.exec(document.cookie); 
  return (value != null) ? unescape(value[1]) : null; } 
const csrftoken = getCookie('csrftoken');
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
class API {
  constructor(props){
    this.token = '';
    this.baseURL = API_URL;
    this.media_URL = this.baseURL;
    this.csrfToken = getCookie('csrftoken');

    this.verifiedCSRF = false;
    console.log(this.csrfToken)
    this.gettoken ()
  }

  async gettoken ()  {
    return await this.__get__('/security/gettoken/', {
      method: 'GET'
    }).then(response =>{
      this.csrfToken = response.data['csrfToken']
      console.log(this.csrfToken)
      document.cookie = "csrftoken="+response.data['csrfToken']+';'

    })
  }
  csrftoken_(){
    return this.csrfToken;
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
            // this.instance.defaults.headers['X-CSRFToken'] = getCookie('csrftoken')
          })
        })
      }

    }
    async __get__(url, parameters){
      // parameters['csrfmiddlewaretoken'] = this.csrfToken;
      return await axios.get(API_URL+url, parameters)
    }
    async __post__(url, parameters){
      console.log(this.csrftoken_())
      return await fetch(API_URL+url,
        {
          credentials:'include',
          method:'POST',
          headers:{ 'X-CSRFToken':this.csrftoken_() },
          body:JSON.stringify({
            data:parameters,
            csrfmiddlewaretoken:this.csrftoken_()
          })})
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

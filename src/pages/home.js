import React from 'react';
import axios from 'axios';
import {API_URL} from '../utils/backend.js';
import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'
import Publication from '../components/publication.js'
import API from '../utils/backend.js'
const api = new API();

const Home = () => {
	const [items, setItems] = useState([])
	const [hasMore, sethasMore] = useState(true);
	const [pagination, setPagination] = useState(0);
	const navigation = useNavigate();
	function Header(headerTitle, buttonAction){
		return (<header><button onClick={() => navigation(-1)}>asd</button>{headerTitle}</header>)
	}

	function updatePagination(){
		setPagination(pagination + 1 );
	}

	 function MakePublication(){
    let data = new FormData()
    let images_form = []

    const input = document.getElementById('make-publication-input').value
    const images = document.getElementById('make-publication-image-input')

    for(let i = 0; i < images.files.length; i++){
      data.append('images', images.files[i], images.files[i].name )
      images_form.push(images.files[i])
    }

    api.makePost('/posts/make', data)
  }

	function fecthData(){
		try {
			if(!hasMore) return false;

			axios.get(API_URL+'/posts/feed/', {
				params: {
					page: pagination,
				},
			})
			.then(reponse   => reponse.data)
			.then(newItems  => {
				if (newItems.length === 0){
					sethasMore(false);
				} else{
					updatePagination()
					setItems([...items, ...newItems]);
				}
			});
		} catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		const storedItems = JSON.parse(localStorage.getItem('items'));
		const storedPagination = localStorage.getItem('pagination');
		fecthData();
		localStorage.setItem('items', []);
		localStorage.setItem('pagination', []);
		
		if (storedItems) {
			console.log(storedItems)
			setItems(storedItems);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('items', JSON.stringify(items));
		localStorage.setItem('pagination', pagination);

	}, [items, pagination]);

	return (
         <div onScroll={() =>{console.log('scrolll')}} className="publications-container">
         	{Header('Home')}
         	<div className="makePost">
         		<input id = 'make-publication-input' className='Hola'/>
         		<input id = 'make-publication-image-input' name="file" type="file" class="file-input" accept=".jfif,.jpg,.jpeg,.png,.gif" multiple/>
         		<button onClick = {() => MakePublication()}>Subit</button>
         	</div>
            <InfiniteScroll
               dataLength={items.length}
               next={fecthData}
               loader={<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
               hasMore={hasMore}>
               {items.map((post) => (
                <article key={post.id} className="post-container">
                  {<Publication post={post} />}
                </article>
               ))}
            </InfiniteScroll>
         </div>

		)
}


export default Home;
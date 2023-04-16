import React from 'react';
import axios from 'axios';
import {API_connection, API_URL} from '../utils/backend.js';
import {useState, useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'
import Publication from '../components/publication.js'


function Profile({setHeaderTitle, history}){
	const {profileName} = useParams()
	const [items, setItems] = useState([])
	const [hasMore, sethasMore] = useState(true);
	const [following, setfollowing] = useState(false);
	const [pagination, setPagination] = useState(0);
	const navigation = useNavigate();
	setHeaderTitle(profileName);
	
	function Header(headerTitle, buttonAction){
		return (<header><button onClick={() => navigation(-1)}>asd</button>{headerTitle}</header>)
	}

	function updatePagination(){
    	setPagination(pagination + 1 );
	}

	function fecthData(){
		try {
			if(!hasMore) return false;

			axios.get(API_URL+'/posts/users/', {
				params: {
					user:profileName,
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
		fecthData()
	}, []);

	return (
         <div className="publications-container">
         	{Header(profileName)}
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


export default Profile;

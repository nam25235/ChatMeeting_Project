import React,{useState} from 'react';
import {Link} from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [name,setName] = useState('');
    const [room ,setRoom] = useState('');
    
    return(
     <div className="joinOuterContainer" >
         
            <div className="joinInnerContainer">
            <div className="card">
            <h1 className="heading" >Join  with Friend</h1>
            <div><input placeholder="Name" className="joinInput" type="text" onChange={(event)=>setName(event.target.value)}/></div>
            <div><input placeholder="Room" className="joinInput mt-30" type="text"  size="50" onChange={(event)=>setRoom(event.target.value)}/></div>
            <Link onClick={event =>(!name||!room)?event.preventDefault() :null} to={`/chat?name=${name}&room=${room}`}>
           <button className="button mt-30"  type="submit">Sign In</button>
         
            </Link>
            </div>
        </div>
       
    </div>
        
    )
}
export default Join;
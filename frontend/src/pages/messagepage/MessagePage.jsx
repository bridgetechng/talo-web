import React , {useEffect, useState, useRef}  from 'react'
import profilePhoto from '../../images/talo.png'
import './messagepage.css'
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';




const MessagePage = () => {

  /*STATE SET UP*/ 
  const [userInfo,setUserInfo]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo'))) 
  const [focusMessage,setFocusMessage] = useState(" ")
  const [focusMessageDate,setFocusMessageDate] = useState(" ")
  const [focusMessageTime,setFocusMessageTime] = useState(" ")
  const navigate = useNavigate()
  const rightNow = new Date()
  const secondsConverter = function(seconds){
    return new Date(seconds);
  }
 /*STATE SET UP END*/ 

 

/*i call this with onload event handler and get massages from database when the screen reloads */
 const updateData =  async() => {
   
      const userData = await axios.get(`/api/users/${userInfo.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
   
      setUserInfo(userData.data)

    
    }

 

  useEffect(()=>{
  
 

    if(userInfo === null){
      navigate('/')
     
    }

    const fetchUser = async() => {
    const userData = await axios.get(`/api/users/${userInfo.userInfo.id}`) /*i am relying on local storage userinfo here, before setting it to the one from the database */
   
     setUserInfo(userData.data)

   
    }

     fetchUser()


  },[])

  return (
    
    <div className="messagesContainer" onLoad={()=>{updateData()}}>

      <div className="messageList">
      
     { userInfo.userInfo.Messages.length > 0 ?
     
            userInfo.userInfo.Messages.map((item,i)=>{
              console.log(item.date)
           
               return (
            <div className="singleMessage" key={i} onClick ={()=>{setFocusMessage(item.message);setFocusMessageDate(secondsConverter(item.date.seconds*1000).toLocaleDateString());setFocusMessageTime(secondsConverter(item.date.seconds*1000).toLocaleTimeString())}}>
          
            <img src={profilePhoto} className="senderPic" alt="talo symbol" />
            <div className="messageDetails">
              <div className="messageDesc"><span>Talo</span><span>{secondsConverter(item.date.seconds*1000).toLocaleDateString()}</span> </div>
              <div className="messagePreamble">{item.message.substring(0,15)+ "..."}</div>
            </div>
          </div>
               ) 
           
          
             
              }) :



       
       <div className="singleMessage">
          
         
         <div className="messageDetails">
         
           <div className="messagePreamble">NO NEW MESSAGES</div>
         </div>
       </div>
      }
       
      
      
       </div>
      
      <div className="messageHighlight">
      
        <div className= "chosenMessageTitle">
        <img src={profilePhoto} className="titlePic" alt="talo symbol" />
        <div className="titleSender">
        <h2>Talo</h2>
        <div>{focusMessageDate !== " " ?focusMessageDate:rightNow.toLocaleDateString()}</div> 
        <div>{focusMessageTime !== " " ?focusMessageTime:rightNow.toLocaleTimeString()}</div> 
        </div>
        </div>

        <div className="chosenMessageBody">
         { focusMessage !== " " ?focusMessage:
          
      "CLICK A MESSAGE FROM THE LIST ON THE LEFT, AND IT WILL APPEAR IN FULL HERE."}
      </div>
      </div>
   
    </div>
  )
}

export default MessagePage
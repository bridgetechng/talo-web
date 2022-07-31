import React , {useEffect, useState, useRef}  from 'react'
import profilePhoto from '../../images/talo.png'
import './messagepage.css'





const MessagePage = () => {
  return (
    
    <div className="messagesContainer">

      <div className="messageList">
      
       {/*1 */}
       <div className="singleMessage">
          
         <img src={profilePhoto} className="senderPic" alt="talo symbol" />
         <div className="messageDetails">
           <div className="messageDesc"><span>Talo</span><span>2 days</span> </div>
           <div className="messagePreamble">Success! Thank you for...</div>
         </div>
       </div>
       
       {/*2 */}
       <div className="singleMessage">
          
          <img src={profilePhoto} className="senderPic" alt="talo symbol" />
          <div className="messageDetails">
            <div className="messageDesc"><span>Talo</span><span>2 days</span> </div>
            <div className="messagePreamble">Success! Thank you for...</div>
          </div>
        </div>
      
       </div>
      
      <div className="messageHighlight">
      
        <div className= "chosenMessageTitle">
        <img src={profilePhoto} className="titlePic" alt="talo symbol" />
        <div className="titleSender">
        <h2>Talo</h2>
        <div>16th August, 2022</div> 
        </div>
        </div>

        <div className="chosenMessageBody">
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores saepe voluptas impedit suscipit illo enim magni optio recusandae, debitis molestias quam distinctio iste laboriosam ut minus corporis blanditiis. Esse, assumenda.
      Delectus sed sunt soluta consequatur, libero id. Magnam quam, odio maiores voluptatem, beatae omnis impedit atque error asperiores, nostrum cum ut consectetur assumenda commodi minus laboriosam suscipit perspiciatis consequatur? Ad?
      Ipsam incidunt culpa id a illum consectetur sit mollitia cumque animi ipsa eum reprehenderit sint reiciendis similique, expedita eligendi maiores! Quisquam cum rerum reprehenderit laboriosam odio quaerat culpa, nostrum consequuntur.
      Perferendis magni dolore explicabo minima et voluptas ullam nostrum reiciendis, asperiores molestias natus accusamus alias quam sint enim, in tempore recusandae est praesentium excepturi. Delectus reprehenderit suscipit vel nisi cumque!
      Quisquam libero ipsam facere modi explicabo quia a sed perspiciatis molestias omnis sit rem exercitationem iure voluptate quibusdam illo cum quo maiores numquam ipsum, doloremque officia. Perferendis nam natus officiis.
      </div>
      </div>
   
    </div>
  )
}

export default MessagePage
//i just learnt you can save as a jsx file here!

import React from 'react'
import { useNavigate} from 'react-router-dom';
import './topbar.css'
import logo from '../../images/uhlogo.png'
import profile from '../../images/sample-profile.jpg'
import { NotificationsNone,Settings} from '@mui/icons-material/';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { useState,useEffect } from 'react'
import { Button } from 'react-bootstrap';

export default function Topbar(){

    const navigate = useNavigate()

    const [visible,setVisible] = useState(false)
    const [userInfo,setUserInfo]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo')))
    console.log(userInfo.userInfo)

    const upMenu = function(){
        setVisible(true)
     }
  
     const downMenu = function(){
  
       setVisible(false)
     }

     const logOut = function(){
        sessionStorage.removeItem('userInfo')
        navigate('/')
      }

    return (
        
        <div className="topbar"> 
         <div className="topbarWrapper">
             
                <div className="topLeft">
                     <img src={logo} className="uh" alt='urban hive logo'></img>
                    
                    </div>

                         

        {/*1*/}   <div className="topRight">
                        
                        
                        <div className="topbarIconContainer">
                        
                         
                          <span className="loggedUser">
                          {userInfo.userInfo.firstName.toUpperCase()} 
                          {' '}
                          {userInfo.userInfo.lastName.toUpperCase()}
                          &nbsp;&nbsp;
                            <ExpandCircleDownIcon style={{backgroundColor:"inherit",color:"rgb(30, 121, 3)"}} onClick={upMenu} onMouseLeave={downMenu}/>
                          </span>
                         
                         <NotificationsNone className="notificationIcon"  />
                         <span className="topIconBadge">
                             2
                         </span>

                       {visible &&  <div className="logOutOptions" onMouseEnter={upMenu} onMouseLeave={downMenu} onClick={logOut}>
                                     <div className="optionItem1"> <span className='logOut'><button className="widgetSmButton1">LOG OUT </button></span></div>
                          
                                 </div>}
                         

                      </div>
                <img src={userInfo.userInfo.profileImage && userInfo.userInfo.profileImage !=="" ?userInfo.userInfo.profileImage:profile} alt="profile pic" className="topAvatar" />

         
                    </div> 


         </div> {/*topbarWrapper ending */}
        </div>
    )
}
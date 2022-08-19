import React,{useState} from 'react';
import './balancebox.css'
import Balanceitem from '../balanceitem/Balanceitem'
import axios from 'axios'  

export default function Balancebox (props){
const [userInfo,setUserInfo]  = useState(JSON.parse(window.sessionStorage.getItem('userInfo'))) 
console.log(userInfo)

const updateData = async()=>{
 
    const userData = await axios.get(`/api/users/${userInfo.userInfo.id}`) 
    setUserInfo(userData.data)
   
   }

    return(
         <>

          <div className="balanceboxContainer widgetWidth" /* onLoad={()=>{updateData()}}*/>
          <h4 className="messageTitle"> Wallet</h4>
              <Balanceitem name={"BALANCE"} symbol={"balance"} value={props.userBalance}/>
              <hr style={{color:"black",width:"100%", fontSize:"2rem"}}/> {/*this is a makeshift to complete the bottom border of balance box above */}
              <Balanceitem name={"LOANS"} symbol={"loans"} value={0} /> {/* this 0 is supposed to be from userInfo.userInfo.loans , but i dont know whether loans will be a single value or an array in the database */}
              
              
           </div>   
         

         
         </>
     )

}
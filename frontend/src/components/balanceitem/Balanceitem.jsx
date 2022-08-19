
import React from 'react';
import './balanceitem.css'

import ReplyIcon from '@mui/icons-material/Reply';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCardIcon from '@mui/icons-material/AddCard';

/*import Developerpic1 from '../../images/headshot-for-startup.webp'*/
import Developerpic2 from '../../images/Jonathan-Headshot.jpg'

export default function BalanceItem(props){

      return(
          
          <ul className="widgetSmList1">
           <li className="widgetSmListItem1">
            
           <button className="widgetSmButton1">
              {props.symbol === 'balance' && <AccountBalanceWalletIcon className='buttonBackground1'/>}
              {props.symbol === 'loans' && <AddCardIcon className='buttonBackground1'/>}
              
              
              {props.name} 
          </button>


            <div className="widgetSmUser1">
           
             <span className="widgetSmUsername1">$ {props.value.toLocaleString()}</span>
             
           
            </div>
          
         </li>

          </ul>
            
          
            
      )
}
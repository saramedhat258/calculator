import React from 'react'
import { Actions } from '../App'
function Operationbtn({dispatch,operation}) {
    return (
        <button className='rounded-3' onClick={()=>dispatch({type:Actions.CHOOSE_OPERATION,payload:{operation}})}>
            {operation}
            </button>
    )
}

export default Operationbtn
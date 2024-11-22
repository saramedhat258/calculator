import React from 'react'
import { Actions } from '../App'
function DigitButton({dispatch,digit}) {
    return (
        <button className='rounded-3' onClick={()=>dispatch({type:Actions.ADD_DIGIT,payload:{digit}})}>
            {digit}
            </button>
    )
}

export default DigitButton
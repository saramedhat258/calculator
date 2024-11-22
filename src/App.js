import { useReducer, useState } from 'react';
import './App.scss'
import DigitButton from './components/DigitButton';
import Operationbtn from './components/Operationbtn';

export const Actions = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE: 'delete',
  EVAULATE: 'evaluate'
}
function reducer(state, { type, payload }) {
  switch (type) {
    case Actions.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state //dont do anything
      if (payload.digit === "." && state.currentOperand.includes(".")) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case Actions.CLEAR:
      return {}
    case Actions.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state
      if (state.currentOperand == null) {
        return {
          ...state,
          Operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          Operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        Operation: payload.operation,
        currentOperand: null,
      }
    case Actions.EVAULATE:
      if (state.Operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        Operation: null,
        currentOperand: evaluate(state),
      }
    case Actions.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    default:
      break;
  }
}
function evaluate({ currentOperand, previousOperand, Operation }) {
  const curr = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)
  if (isNaN(curr) || isNaN(prev)) return ""
  let computation = ''
  switch (Operation) {
    case "+":
      computation = prev + curr
      break;
    case "-":
      computation = prev - curr
      break;
    case "/":
      computation = prev / curr
      break;
    case "x":
      computation = prev * curr
      break;
    default:
      break;
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, Operation }, dispatch] = useReducer(reducer, {})
  const [mode, setmode] = useState()
  return (
    <div className={`App ${mode === 1 ? "one" : mode === 2 ? "two" : mode === 3 ? "three" : 'one'}`}>
      <section className="calc pt-5 w-25 m-auto">
        <section className='d-flex justify-content-between mt-3'>
          <p className='fs-2 fw-bold'>calc</p>
          <section className='mt-2 theme'>
            <p className='d-inline-block mx-2'>theme:</p>
            <button className="rounded-circle border-0 px-2 mx-1 fw-bold" onClick={() => setmode(1)}>1</button>
            <button className="rounded-circle border-0 px-2 mx-1 fw-bold" onClick={() => setmode(2)}>2</button>
            <button className="rounded-circle border-0 px-2 mx-1 fw-bold" onClick={() => setmode(3)}>3</button>
          </section>
        </section>

        <div className="result rounded-3 mb-3 mt-2 d-flex flex-column gap-3 justify-content-between align-items-end p-2">
          <div className="prevoperand d-flex ">{formatOperand(previousOperand)}{Operation}</div>
          <div className='currentoperand '>{formatOperand(currentOperand)}</div>
        </div>
        <div className='btns rounded-3'>
          <DigitButton digit={"7"} dispatch={dispatch} />
          <DigitButton digit={"8"} dispatch={dispatch} />
          <DigitButton digit={"9"} dispatch={dispatch} />
          <button className='rounded-3 blue text-white' onClick={() => dispatch({ type: Actions.DELETE })}>DEL</button>
          <DigitButton digit={"4"} dispatch={dispatch} />
          <DigitButton digit={"5"} dispatch={dispatch} />
          <DigitButton digit={"6"} dispatch={dispatch} />
          <Operationbtn operation="+" dispatch={dispatch} />
          <DigitButton digit={"1"} dispatch={dispatch} />
          <DigitButton digit={"2"} dispatch={dispatch} />
          <DigitButton digit={"3"} dispatch={dispatch} />
          <Operationbtn operation="-" dispatch={dispatch} />
          <DigitButton digit={"."} dispatch={dispatch} />
          <DigitButton digit={"0"} dispatch={dispatch} />
          <Operationbtn operation="/" dispatch={dispatch} />
          <Operationbtn operation="x" dispatch={dispatch} />
          <button className='span2 rounded-3 blue text-white' onClick={() => dispatch({ type: Actions.CLEAR })}>RESET</button>
          <button className='span2 rounded-3 orange text-white' onClick={() => dispatch({ type: Actions.EVAULATE })}>=</button>
        </div>

      </section>
    </div>
  );
}

export default App;

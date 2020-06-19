import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setBase, setStatus } from '../redux/reducers/cardreducer'
import shopopalostore from '../assets/images/shopopalostore.png'
import icons8basket from '../assets/images/icons8basket.png'

const Header = () => {
  const dispatch = useDispatch()
  const rates = useSelector((store) => store.cardreducer.rates)
  const base = useSelector((store) => store.cardreducer.base)
  const cards = useSelector((store) => store.cardreducer.cards)
  const selection = useSelector((store) => store.cardreducer.selection)

  const getPrice = (id) => cards.find((it) => it.id === id).price
  const totalSum = Object.entries(selection).reduce(
    (acc, [id, qty]) => acc + getPrice(id) * qty * (rates[base] || 1),
    0
  )
  const totalIt = Object.values(selection).reduce((acc, rec) => acc + rec, 0)

  return (
    <nav className="flex flex-wrap justify-between bg-green-600 h-25 p-6 mb-5 rounded shadow">
      <Link to="/">
        <img className="flex self-center mt-2" src={shopopalostore} alt="shopopalostore" />
      </Link>
      <div className="flex">
        {['CAD', 'EUR', 'USD'].map((it) => {
          return (
            <button
              type="button"
              key={it}
              className={`bg-green-300 hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow ${
                base === it ? 'underline' : ''
              }`}
              onClick={() => {
                dispatch(setBase(it))
              }}
            >
              {it}
            </button>
          )
        })}
      </div>
      <div className="flex">
        <Link
          to="/logs"
          className="bg-green-300 hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow"
        >
          Logs
        </Link>
      </div>
      <div>
        <button
          type="button"
          className="bg-green-300 hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow"
          onClick={() => {
            dispatch(setStatus('Price'))
          }}
        >
          Price
        </button>
        <button
          type="button"
          className="bg-green-300 hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow"
          onClick={() => {
            dispatch(setStatus('A-z'))
          }}
        >
          A-z
        </button>
      </div>
      <div className="flex bg-green-300 text-green-900 py-1 px-4 border border-green-400 rounded shadow">
        Sum {totalSum !== 0 && totalSum.toFixed(2)}
        <Link to="/basket">
          <img className="flex h-full pr-4 pl-4" src={icons8basket} alt="icons8basket" />
        </Link>
        Total {totalIt !== 0 && totalIt}
      </div>
    </nav>
  )
}

export default Header

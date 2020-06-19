import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToSelection, removeFromSelection, sortElements } from '../redux/reducers/cardreducer'

const Cards = () => {
  const cards = useSelector((store) => store.cardreducer.cards)
  const status = useSelector((store) => store.cardreducer.status)
  const selection = useSelector((store) => store.cardreducer.selection)
  const rates = useSelector((store) => store.cardreducer.rates)
  const base = useSelector((store) => store.cardreducer.base)
  const dispatch = useDispatch()
  const baseSymb = {
    USD: 'USD',
    EUR: 'EUR',
    CAD: 'CAD'
  }

  return (
    <div className="flex flex-wrap content-center justify-center">
      {sortElements(cards, status).map((it) => {
        return (
          <div
            key={it.id}
            className="flex flex-col border-1 border-solid border-black w-64 h-64 p-2 m-4 shadow-md"
          >
            <div className="flex justify-center font-semibold">{it.title}</div>
            <div className="flex justify-center">
              <img
                className="h-32 w-full object-cover object-center mt-3"
                src={it.image}
                alt={it.title}
              />
            </div>
            <div className="flex justify-center font-semibold">
              {(it.price * (rates[base] || 1)).toFixed(2)}
              {baseSymb[base] || 'EUR'}
            </div>
            <div className="flex justify-around mt-1">
              <button
                type="button"
                className="bg-white hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow"
                onClick={() => {
                  dispatch(removeFromSelection(it.id, it))
                }}
              >
                -
              </button>
              <div className="text-black font-semibold py-2 px-4">{selection[it.id] || 0}</div>
              <button
                type="button"
                className="bg-white hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow"
                onClick={() => {
                  dispatch(addToSelection(it.id, it))
                }}
              >
                +
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Cards

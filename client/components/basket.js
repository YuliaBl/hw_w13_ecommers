import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { addToSelection, removeFromSelection } from '../redux/reducers/cardreducer'
import Header from './header'

const Basket = () => {
  const selection = useSelector((store) => store.cardreducer.selection)
  const basket = useSelector((store) => store.cardreducer.basket)
  const rates = useSelector((store) => store.cardreducer.rates)
  const base = useSelector((store) => store.cardreducer.base)
  const cards = useSelector((store) => store.cardreducer.cards)
  const dispatch = useDispatch()
  const basketArray = Object.values(basket)

  const baseSymb = {
    USD: 'USD',
    EUR: 'EUR',
    CAD: 'CAD'
  }

  const getPrice = (id) => cards.find((it) => it.id === id).price
  const totalSum = Object.entries(selection).reduce(
    (acc, [id, qty]) => acc + getPrice(id) * qty * (rates[base] || 1),
    0
  )
  const totalIt = Object.values(selection).reduce((acc, rec) => acc + rec, 0)

  return (
    <div>
      <Header />
      <div className="flex flex-col content-start justify-start">
        {basketArray.map((card) => {
          return (
            <div
              key={card.id}
              className="border-1 border-solid border-black h-15 p-2 m-4 shadow-md  grid grid-cols-5  content-start"
            >
              <img
                className="h-full w-12 object-cover object-center mr-3"
                src={card.image}
                alt={card.title}
              />
              <div className="justify-start font-semibold mr-3 col-span-2">
                {card.title}
                <br />
                Price: {card.price * (rates[base] || 1)}
                {baseSymb[base] || 'EUR'}
              </div>
              <div className="flex justify-around font-semibold mr-3">
                Qty: {selection[card.id] || 0}
                <button
                  type="button"
                  className="mr-3 bg-white hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow"
                  onClick={() => {
                    dispatch(removeFromSelection(card.id, card))
                  }}
                >
                  -
                </button>
                <button
                  type="button"
                  className="bg-white hover:bg-green-100 text-green-900 py-2 px-4 border border-green-400 rounded shadow"
                  onClick={() => {
                    dispatch(addToSelection(card.id, card))
                  }}
                >
                  +
                </button>
              </div>
              <div className="flex justify-around font-semibold">
                Total Price:
                <br />
                {card.price * (rates[base] || 1) * selection[card.id]}
                {baseSymb[base] || 'EUR'}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex bg-green-300 text-black font-bold py-2 px-4 border border-green-400 rounded shadow">
        Sum {totalSum !== 0 && totalSum.toFixed(2)}
        <br />
        Total {totalIt !== 0 && totalIt}
      </div>
    </div>
  )
}

export default Basket

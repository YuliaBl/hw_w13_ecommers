import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import Header from './header'
import { getLogs } from '../redux/reducers/cardreducer'

const Logs = () => {
  const logs = useSelector((store) => store.cardreducer.logs)
  const newLogs = Object.values(logs)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getLogs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Header />
      <div className="flex flex-col content-start justify-start">
        {newLogs.map((it) => {
          return (
            <div
              key={it.id}
              className="border-1 border-solid font-semibold border-black h-15 p-2 m-4 shadow-md content-start"
            >
              {it.type}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Logs

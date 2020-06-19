import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Header from './header'
import Cards from './cards'
import { getProducts, getRates } from '../redux/reducers/cardreducer'

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getRates())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Header />
      <Cards />
    </div>
  )
}

Home.propTypes = {}

export default Home

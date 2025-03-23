import React, { useContext } from 'react'
import Layout from '../../components/Layout/layout'
import MyContext from '../../context/data/myContext'
import HeroSection from '../../components/heroSection/heroSection'
import HighBountyItems from './components/highBounty'
import Testimonials from './components/testimonials'

function HomePage() {
  const context = useContext(MyContext)
  return (
    <Layout>
      <HeroSection/>
      <HighBountyItems/>
      <Testimonials/>
    </Layout>
  )
}

export default HomePage

import React, { useEffect } from 'react'
import '../Action/Action.css'
import Step1_Image from '../../assets/images/shape1.png'
import Step2_Image from '../../assets/images/shape2.png'
import Step3_Image from '../../assets/images/shape3.png'
import Step4_Image from '../../assets/images/shape4.png'
import Arrow1 from '../../assets/images/curve1.png'
import Arrow2 from '../../assets/images/curve2.png'
import Arrow3 from '../../assets/images/curve3.png'
import Steps from '../../assets/images/Early Start Steps.png'

const Action = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className='action-container'>
      <h2>How EarlyStart E-Tutors Works</h2>

      <div className="action-divide">
        <div className="action-left">
          <h3 className='steps'>1. Get Started with a Click</h3>
          <p className='steps-sub'>Begin your journey by visiting our website and signing up. It's quick and easy</p>
          <h3 className='steps'>2. Specify Your Child's Needs</h3>
          <p className='steps-sub'>Input the area where your child requires tutoring, whether it's Number Work, Quantitative Reasoning, Mathematics, Letter Work, Word Formation, Phonetics, Languages and so on.</p>
          <h3 className='steps'>3. Choose Your Schedule</h3>
          <p className='steps-sub'>Select your preferred schedule time, either weekdays or weekends, to fit your family's routine.</p>
          <h3 className='steps'>4. Get Paired with a Tutor</h3>
          <p className='steps-sub'>We will match your child with a qualified tutor who specializes in the chosen subject area and fits your schedule.</p>
        </div>

        <div className="action-right">
          <img src={Steps} alt="Steps" width={"100%"} />
          {/* <div className="">
            <img src={Step1_Image} alt="" width={"15%"} className='step-icon-1'/>
            <p className='step-click-1'>Get Started With a Click</p>

            <img src={Arrow1} alt="" width={"20%"} className='arrow-1'/>

            <img src={Step2_Image} alt="" width={"15%"} className='step-icon-2'/>
            <p className='step-click-2'>Specify Your Child's Needs</p>

            <img src={Step3_Image} alt="" width={"15%"} className='step-icon-3'/>
            <p className='step-click-3'>Choose Your Schedule</p>

            <img src={Step4_Image} alt="" width={"15%"} className='step-icon-4'/>
            <p className='step-click-4'>Get Paired with a Tutor</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Action
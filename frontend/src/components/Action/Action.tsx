import React, { useEffect } from 'react'
import '../Action/Action.css'
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
          <p className='steps-sub'>Begin your journey by visiting our website and signing up. It's quick and easy.</p>
          <h3 className='steps'>2. Specify Your Child's Needs</h3>
          <p className='steps-sub'>Input the area where your child requires tutoring, whether it's Number Work, Quantitative Reasoning, Mathematics, Letter Work, Word Formation, Phonetics, Languages etc.</p>
          <h3 className='steps'>3. Choose Your Schedule</h3>
          <p className='steps-sub'>Select your preferred schedule time, either weekdays or weekends, to fit your family's routine.</p>
          <h3 className='steps'>4. Get Paired with a Tutor</h3>
          <p className='steps-sub'>We will match your child with a qualified tutor who specializes in the chosen subject area and fits your schedule.</p>
        </div>

        <div className="action-right">
          <img src={Steps} alt="Steps" width={"100%"} />
        </div>
      </div>
    </div>
  )
}

export default Action

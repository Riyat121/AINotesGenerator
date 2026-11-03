import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"
// import logo from "../assets/logo.png"

function Navbar() {
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits
  const [showCredits, setShowCredits] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
      navigate("/auth")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <motion.div
      initial = {{opacity: 0 , y:-20}}
      animate = {{opacity:1 , y:0}}
      transition={{duration:1.2}}
      className='relative z-20 mx-6 mt-8
        rounded-3xl
        bg-linear-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/90
        backdrop-blur-2xl
        border border-indigo-200/15
        shadow-[0_22px_55px_rgba(15,23,42,0.7)]
        flex items-center justify-between px-8 py-4'>

        <div className='flex items-center gap-3'>
          {/* <img src={logo} alt="examnotes" className='w-9 h-9' /> */}
          <span className='text-lg hidden md:block font-semibold text-white'>
            ExamNotes <span className='text-indigo-300'>AI</span>
          </span>
        </div>

        <div className='flex items-center gap-6 relative'>

          {/* CREDITS */}
          <div className='relative'>

            <motion.div
              whileHover={{scale:1.06}}
              onClick={() => { setShowCredits(!showCredits); setShowProfile(false) }}
              className='flex items-center justify-center gap-1
              px-4 py-2 rounded-full
              bg-indigo-200/10
              border border-indigo-200/25
              text-white text-sm
              shadow-md
              cursor-pointer'>
                <span className='text-xl'>💎</span>
                <span>{credits}</span>

                <motion.span
                  whileHover={{scale:1.07}}
                  whileTap={{scale:0.95}}
                  className='ml-2 h-5 w-5 flex items-center justify-center
                  rounded-full bg-indigo-100 text-slate-900 text-xs font-bold'
                >
                  ➕
                </motion.span>

            </motion.div>

            <AnimatePresence>
              {showCredits &&
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 8, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className='absolute right-0 mt-4 w-64
                rounded-2xl
                bg-slate-900/95 backdrop-blur-xl
                border border-indigo-200/15
                shadow-[0_25px_60px_rgba(15,23,42,0.75)]
                p-4 text-white'>
                  <h4 className='font-semibold mb-2'>Buy Credits</h4>
                  <p className='text-sm text-slate-300 mb-4'>Use credits to generate AI notes, diagrams & PDFs.</p>
                  <button onClick={() => {setShowCredits(false); navigate('/pricing')}} className='w-full py-2 rounded-xl
                  bg-linear-to-br from-indigo-100 to-slate-200
                  text-slate-900 font-semibold
                  hover:opacity-90'>Buy More Credits</button>

              </motion.div>}
            </AnimatePresence>
          </div>

          {/* PROFILE */}
          <div className='relative'>

            <motion.div
              whileHover={{scale:1.06}}
              whileTap={{scale:0.96}}
              onClick={() => { setShowProfile(!showProfile); setShowCredits(false) }}
              className='flex items-center justify-center gap-1
              px-4 py-2 rounded-full
              bg-indigo-200/10
              border border-indigo-200/25
              text-white text-sm
              shadow-md
              cursor-pointer'>
                <span className='text-lg'>{userData?.name?.slice(0,1).toUpperCase()}</span>

            </motion.div>

            <AnimatePresence>
              {showProfile &&
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 10, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className='absolute right-0 mt-4 w-56
                rounded-2xl
                bg-slate-900/95 backdrop-blur-xl
                border border-indigo-200/15
                shadow-[0_25px_60px_rgba(15,23,42,0.75)]
                p-3 text-white'>

                  <MenuItem text="History" onClick={() => {setShowProfile(false); navigate('/history')}} />
                  <div className="h-px bg-indigo-200/15 mx-3" />
                  <MenuItem text="Sign out" red onClick={() =>  handleSignOut()} />

              </motion.div>}
            </AnimatePresence>

          </div>
        </div>

    </motion.div>
  )
}

function MenuItem({ onClick, text, red }) {
  return (
    <div onClick={onClick} className={`
      w-full text-left px-5 py-3 text-sm rounded-xl
      transition-colors cursor-pointer
      ${
        red
          ? "text-rose-400 hover:bg-rose-500/10"
          : "text-slate-200 hover:bg-white/10"
      }
    `}>
      {text}
    </div>
  )
}

export default Navbar
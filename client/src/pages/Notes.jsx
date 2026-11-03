import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import TopicForm from '../components/TopicForm'
import FinalResult from '../components/FinalResult'
import Sidebar from '../components/Sidebar'

function Notes() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-100 to-slate-200 px-6 py-8'>
      <motion.header
        initial = {{opacity: 0 , y:-15}}
        animate = {{opacity:1 , y:0}}
        transition={{duration:1.2}}

        className=" mb-10
            rounded-3xl
            bg-slate-900/85 backdrop-blur-xl
            border border-indigo-200/15
            px-8 py-6
            shadow-[0_22px_50px_rgba(15,23,42,0.6)] items-start
            flex md:items-center justify-between gap-4 flex-col md:flex-row"
          >
            <div onClick={() => navigate("/")} className='cursor-pointer'><h1 className='text-2xl font-bold
            bg-linear-to-r from-white via-indigo-200 to-white
            bg-clip-text text-transparent'>ExamNotes AI</h1>
            <p className='text-sm text-slate-300 mt-1'>AI-powered exam-oriented notes & revision</p></div>

          <div className='flex items-center gap-4'>
            <button className='flex items-center gap-2
            px-4 py-2 rounded-full
            bg-indigo-200/10
            border border-indigo-200/25
            text-white text-sm' onClick={() => navigate("/pricing")}>
              <span className='text-xl'>💎</span>
              <span>{credits}</span>
              <motion.span whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.97 }}
                className='ml-2 h-5 w-5 flex items-center justify-center
                rounded-full bg-indigo-100 text-slate-900 text-xs font-bold'
              >
                ➕
              </motion.span>

            </button>
            <button onClick={() => navigate("/history")} className='px-4 py-3 rounded-full
            text-sm font-medium
            bg-indigo-200/10
            border border-indigo-200/25
            text-white
            hover:bg-indigo-200/20
            transition
            flex items-center gap-2'>
              📚 Your Notes

            </button>
          </div>

      </motion.header>

      <div className='max-w-4xl mx-auto'>

        <motion.div
          className="mb-12">
            <TopicForm loading={loading} setResult={setResult} setLoading={setLoading} setError={setError}/>
        </motion.div>

{loading && (
  <motion.div
    animate={{ opacity: [0.4, 1, 0.4] }}
    transition={{ repeat: Infinity, duration: 1.2 }}
    className="text-center text-black font-medium mb-6"
  >
    Generating exam-focused notes…
  </motion.div>
)}

{error && (
  <div className="mb-6 text-center text-red-600 font-medium">
    {error}
  </div>
)}

        {!result &&
        <motion.div whileHover={{ scale: 1.02 }}
          className="
            h-64
            rounded-3xl
            flex flex-col items-center justify-center
            bg-white/70 backdrop-blur-lg
            border border-dashed border-slate-300
            text-slate-500
            shadow-inner
          ">
            <span className="text-4xl mb-3">📘</span>
            <p className="text-sm">
              Generated notes will appear here
            </p>

        </motion.div>}

{result && <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className='flex flex-col
    lg:grid lg:grid-cols-4
    gap-6'>

  <div className='lg:col-span-1'>
    <Sidebar result={result}/>
  </div>

  <div className='lg:col-span-3
    rounded-2xl
    bg-white
    shadow-[0_15px_40px_rgba(0,0,0,0.15)]
    p-6'>
<FinalResult  result={result}/>
  </div>

</motion.div>
}
      </div>

    </div>
  )
}

export default Notes
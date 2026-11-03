import React from 'react'
import { motion } from "motion/react"
import Navbar from '../components/Navbar'
import imghome from "../assets/istockphoto-1406921267-612x612.jpg"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
function Home() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen overflow-hidden bg-slate-100 text-black'>
      <Navbar/>
      {/* top */}
      <section className='max-w-7xl mx-auto px-8 pt-28 grid grid-cols-1
      lg:grid-cols-2 gap-16 items-center' style={{ perspective: 1000 }}>
        <div>
          <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ rotateX: 5, rotateY: -5 }}
          className="transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1 className="text-5xl lg:text-6xl font-extrabold leading-tight
            bg-linear-to-br from-slate-900/90 via-indigo-900/70 to-slate-900/90
            bg-clip-text text-transparent"
             whileHover={{ y: -5 }}
             style={{
              transform: "translateZ(40px)",
              textShadow: "0 16px 36px rgba(15,23,42,0.25)",
             }}
            >
              Create Smart <br /> AI Notes in Seconds

            </motion.h1>

            <motion.p whileHover={{ y: -3 }}
             className=' mt-6 max-w-xl text-lg
              bg-linear-to-br from-slate-700 via-slate-500/80 to-slate-700
              bg-clip-text text-transparent'
              style={{
                transform: "translateZ(30px)",
                textShadow: "0 14px 32px rgba(15,23,42,0.2)",
              }}
            >
              Generate exam-focused notes, project documentation,
          flow diagrams and revision-ready content using AI
          faster, cleaner and smarter.

            </motion.p>

            <motion.button
            onClick={() => navigate("/notes")}
              whileHover={{ y: -8, rotateX: 6, rotateY: -6, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className='mt-10 px-10 py-3 rounded-2xl
                flex items-center gap-3
                bg-linear-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/90
                border border-indigo-200/15
                text-white font-semibold text-lg
                shadow-[0_22px_55px_rgba(15,23,42,0.65)]'>

              Get Started


            </motion.button>

          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            y: -10,
            rotateX: 6,
            rotateY: -6,
            scale: 1.04,
          }}
          className="transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img src={imghome} alt="Description" className="w-full h-full object-cover rounded-3xl" />
        </motion.div>

      </section>

      {/* bottom */}
      <section className='max-w-6xl mx-auto px-8 py-28 grid grid-cols-1
      sm:grid-cols-2 lg:grid-cols-4 gap-8' style={{ perspective: 1000 }}>
        <Feature icon="📘" title="Exam Notes" des="High-yield exam-oriented notes with revision points."/>
        <Feature icon="📁" title="Project Notes" des="Well-structured content for assignments and projects." />
        <Feature icon="📊" title="Diagrams" des="Auto-generated visual diagrams for clarity." />
        <Feature icon="⬇️" title="PDF Download" des="Download clean, printable PDFs instantly." />

      </section>
  <Footer />
    </div>
  )
}

function Feature({icon , title , des}){
    return(
        <motion.div
        whileHover={{ y: -10, rotateX: 6, rotateY: -6, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className='relative rounded-3xl p-6
        bg-linear-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/90
        backdrop-blur-2xl
        border border-indigo-200/15
        shadow-[0_28px_70px_rgba(15,23,42,0.65)]
        text-white'
        style={{ transformStyle: "preserve-3d" }}
        >
            <div className='absolute inset-0 rounded-3xl
            bg-linear-to-br from-white/15 to-transparent
            opacity-0 hover:opacity-100 transition-opacity
            pointer-events-none'></div>

            <div className='relative z-10' style={{ transform: "translateZ(30px)" }}>
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{des}</p>
            </div>

        </motion.div>
    )
  
}

export default Home
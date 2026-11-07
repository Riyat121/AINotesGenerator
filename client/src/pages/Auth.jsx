import React from 'react'
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { auth, provider } from "../utils/firebase"

provider.setCustomParameters({
  prompt: "select_account"
})
import {serverUrl} from "../App"
import { signInWithPopup } from "firebase/auth"
import axios from 'axios'
function Auth() {

const handleGoogleAuth = async () => {
     try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;

      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );

      console.log("User authenticated:", result.data);
      dispatch(setUserData(result.data));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during Google authentication:", error);
    }
  }


  return (
    <div className='min-h-screen overflow-hidden bg-slate-100 text-black px-8'>
      <motion.header
        initial = {{opacity: 0 , y:-20}}
        animate = {{opacity:1 , y:0}}
        transition={{duration:1.2}}

        className=" max-w-6xl mx-auto mt-10
          rounded-3xl
          bg-slate-900/85 backdrop-blur-2xl
          border border-indigo-300/20
          px-10 py-8
          shadow-[0_25px_60px_rgba(15,23,42,0.55)]"
        >
          <h1 className='text-3xl font-extrabold
          bg-linear-to-r from-indigo-200 via-sky-200 to-white
          bg-clip-text text-transparent'>ExamNotes AI</h1>
          <p className='mt-2 text-sm text-slate-300'>Smart notes, diagrams and revision in one place</p>

      </motion.header>

      <main className='max-w-6xl mx-auto py-12 grid grid-cols-1 lg:grid-cols-2 gap-16
      items-center'>

        {/* LEFT CONTENT */}
        <motion.div
         initial = {{opacity: 0 , x:-50}}
        animate = {{opacity:1 , x:0}}
        transition={{duration:0.8}}
        >
            <h1 className='text-5xl lg:text-6xl font-extrabold leading-tight
            bg-linear-to-br from-slate-900/90 via-indigo-900/70 to-slate-900/90
            bg-clip-text text-transparent'>
              Unlock Smart <br /> AI Notes
            </h1>
            <motion.button
            onClick={handleGoogleAuth}
            whileHover={{
              y:-8,
              rotateX:6,
              rotateY:-6,
              scale:1.05
            }}
            whileTap={{scale:0.96}}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
             className='mt-10 px-9 py-3.5 rounded-2xl
            flex items-center gap-3
            bg-linear-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/90
            border border-indigo-200/15
            text-white font-semibold text-lg
            shadow-[0_20px_50px_rgba(15,23,42,0.6)]'>
              <FcGoogle size={22}/>
              Continue with Google


            </motion.button>

            <p className=' mt-7 max-w-xl text-lg
            bg-linear-to-br from-slate-700 via-slate-500/80 to-slate-700
            bg-clip-text text-transparent'>
              You get <span className="font-semibold">500 FREE credits</span> to create
          exam notes, project notes, charts, graphs and
          download clean PDFs — instantly using AI.
            </p>
            <p className='mt-5 text-sm text-slate-500'> Start with 50 free credits • Upgrade
            anytime for more credits • Instant access</p>

        </motion.div>

        {/* RIGHT CONTENT */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6' style={{ perspective: 1000 }}>
          <Feature icon="🎁" title="500 Free Credits" des="Start with 500 credits to generate notes without paying."/>
          <Feature icon="📘" title="Exam Notes" des="High-yield, revision-ready exam-oriented notes." />
          <Feature icon="📁" title="Project Notes" des="Well-structured documentation for assignments & projects." />
          <Feature icon="📊" title="Charts & Graphs" des="Auto-generated diagrams, charts and flow graphs." />
          <Feature icon="⬇️" title="Free PDF Download" des="Download clean, ready-to-print PDFs instantly." />

        </div>


      </main>

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

export default Auth
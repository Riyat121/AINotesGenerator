import React, { useState } from 'react'
import { motion } from "motion/react"
import { generateNotes } from '../services/api';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
function TopicForm({ setResult, setLoading, loading, setError }) {
    const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
const [progress, setProgress] = useState(0);
const [progressText, setProgressText] = useState("");
 const dispatch = useDispatch();
const handleSubmit = async () => {
  if (!topic.trim()) {
    setError("Please enter a topic.");
    return;
  }
  setError("");
  setLoading(true);
  setResult(null);
  try {
    const result = await generateNotes({
      topic, classLevel, examType,
      revisionMode, includeDiagram, includeChart
    });

    setResult(result.data);
    setLoading(false);
    setClassLevel("");
    setExamType("");
    setRevisionMode(false);
    setIncludeDiagram(false);
    setIncludeChart(false);

    if(typeof result.data.creditsLeft === "number"){
      // Update credits in Redux store
      dispatch(updateCredits(result.data.creditsLeft));
    }
  } catch (error) {
    console.error("Error generating notes:", error);
    setError(error.response?.data?.message || "An error occurred while generating notes. Please try again.");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
if(!loading){
  setProgress(0);
  setProgressText("");
  return;
}
let value =0;
const interval = setInterval(() => {
  value += Math.floor(Math.random() * 8);
  if (value >= 95) {
    value = 95;
    setProgressText("Almost done...");
    clearInterval(interval);

  }
  else if (value > 70) {
    setProgressText("Generating notes...");
  }
  else if (value > 40) {
    setProgressText("Processing your request...");
  }
  else{
    setProgressText("Starting generation...");
  }
  
  setProgress(Math.floor(value));

}, 700
);
return () => clearInterval(interval);
},[loading] )

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-3xl
        bg-linear-to-br from-slate-900/90 via-indigo-950/80 to-slate-900/90
        backdrop-blur-2xl
        border border-indigo-200/15
        shadow-[0_25px_60px_rgba(15,23,42,0.75)]
        p-8
        space-y-6
        text-white
      ">

        <input type="text" className=' w-full p-3 rounded-2xl
        bg-indigo-200/10 backdrop-blur-lg
        border border-indigo-200/20
        placeholder-slate-400
        text-white
        focus:outline-none focus:ring-2 focus:ring-indigo-200/30'
        placeholder='Enter topic (e.g. Web Development)'
        onChange={(e)=>setTopic(e.target.value)}
        value={topic}
        />

        <input type="text" className=' w-full p-3 rounded-2xl
        bg-indigo-200/10 backdrop-blur-lg
        border border-indigo-200/20
        placeholder-slate-400
        text-white
        focus:outline-none focus:ring-2 focus:ring-indigo-200/30'
        placeholder='Class / Level (e.g. Class 10)'
        onChange={(e)=>setClassLevel(e.target.value)}
        value={classLevel}
        />

        <input type="text" className=' w-full p-3 rounded-2xl
        bg-indigo-200/10 backdrop-blur-lg
        border border-indigo-200/20
        placeholder-slate-400
        text-white
        focus:outline-none focus:ring-2 focus:ring-indigo-200/30'
        placeholder='Exam Type (e.g. CBSE, JEE, NEET)'
        onChange={(e)=>setExamType(e.target.value)}
        value={examType}
        />

        <div className='flex flex-col md:flex-row gap-6'>
            <Toggle label="Exam Revision Mode" checked={revisionMode} onChange={()=>setRevisionMode(!revisionMode)}/>
            <Toggle
              label="Include Diagram"
              checked={includeDiagram}
              onChange={() => setIncludeDiagram(!includeDiagram)}
            />
            <Toggle
              label="Include Charts"
              checked={includeChart}
              onChange={() => setIncludeChart(!includeChart)}
            />
        </div>

        <motion.button
        onClick={handleSubmit}
          whileHover={!loading ? { scale: 1.04, y: -3 } : {}}
          whileTap={!loading ? { scale: 0.96 } : {}}
          disabled={loading}
          className={`
            w-full mt-4
            py-3 rounded-2xl
            font-semibold
            flex items-center justify-center gap-3
            transition
            ${
              loading
                ? "bg-slate-500/40 text-slate-300 cursor-not-allowed"
                : "bg-linear-to-br from-indigo-100 to-slate-200 text-slate-900 shadow-[0_15px_35px_rgba(15,23,42,0.4)]"
            }
          `}>
            {loading ? "Generating Notes..." : "Generate Notes"}

        </motion.button>
       {loading && (
  <div className='mt-4 space-y-2'>

    <div className='w-full h-2 rounded-full bg-indigo-200/10 overflow-hidden'>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeOut", duration: 0.6 }}
        className='h-full bg-linear-to-r from-indigo-300 via-sky-300 to-indigo-400'
      />
    </div>

    <div className='flex justify-between text-xs text-slate-300'>
      <span>{progressText}</span>
      <span>{progress}%</span>
    </div>

    <p className='text-xs text-slate-400 text-center'>
      This may take 2-4  minutes depending on the topic complexity and server load. Please be patient.
    </p>

  </div>
)}

    </motion.div>
  )
}


function Toggle({label, checked, onChange}){
    return(
        <div className='flex items-center gap-4 cursor-pointer select-none' onClick={onChange}>
            <motion.div
              animate={{
                backgroundColor: checked
                  ? "rgba(99,102,241,0.5)"   // indigo when ON
                  : "rgba(255,255,255,0.15)" // gray when OFF
              }}
              transition={{ duration: 0.25 }}
              className='relative w-12 h-6 rounded-full
              border border-indigo-200/20
              backdrop-blur-lg'
            >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className=' absolute top-0.5
                  h-5 w-5 rounded-full
                  bg-white
                  shadow-[0_5px_15px_rgba(0,0,0,0.5)]'
                  style={{
                    left: checked ? "1.6rem" : "0.25rem",
                  }}
                >
                </motion.div>

            </motion.div>

            <span className={`text-sm transition-colors ${
              checked ? "text-indigo-200" : "text-slate-300"
            }`}>{label}</span>

        </div>
    )
}

export default TopicForm
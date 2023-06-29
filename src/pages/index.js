import Image from 'next/image'
import { Inter, M_PLUS_1 } from 'next/font/google'
import axios from 'axios'
import {AnimatePresence, motion, stagger} from 'framer-motion'
import { useEffect, useState } from 'react'
import React from 'react'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'

import {getNewestRuns, searchGames, updateNewestRuns} from '../functions/api.js'
import {GameListing} from '../components/GameListing.js'
import {RunListing} from '../components/RunListing.js'

import {list, item, loadingIcon} from '../variants/variants.js'

import {getAbrev, convertTime} from '../functions/helperfuncs.js'
import { GameDetail } from '@/components/GameDetail.js'

const inter = Inter({ subsets: ['latin'] })



export default function Home() {

  const [nameQuery, setNameQuery] = useState('');
  const [gameSearchList, setGameSearchList] = useState([]);
  const [newRunsList, setNewRunsList] = useState([]);
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(false);
  const [catIndex, setCatIndex] = useState(0);

  useEffect(() => {
    if (nameQuery.length < 1) {
      setGameSearchList([]);
    }
  }, [nameQuery])

  useEffect(() => {
    if (loading) {
      setGameSearchList([]);
      setGameData();
    }
  }, [loading])

  useEffect(() => {
    if (gameSearchList.length > 0) {
      setGameData();
    }
  }, [gameSearchList])

  useEffect(() => {
    if (gameData) {
      setGameSearchList([]);
    }
  }, [gameData])

  useEffect(() => {
    getNewestRuns(newRunsList, setNewRunsList);
    const interval = setInterval(() => updateNewestRuns(newRunsList, setNewRunsList), 10000);
    return () => {
      clearInterval(interval);
    }
  }, [])

  const handleKeyDown = (event) => {
    if (event.key == 'Enter') {
      setGameSearchList([]); 
      searchGames(nameQuery, setGameSearchList, setLoading);
    }
  }

  return (
    <main
      className={`min-h-screen md:p-24 p-12 ${inter.className}`}
    >
      <AnimatePresence>
      <div className='flex flex-wrap xl:justify-center xl:space-x-6 justify-evenly'>
        <div className='lg:w-[30%] md:w-[50%] w-[100%]'>
          <input 
            className='p-4 text-black'
            onChange={(event) => {setNameQuery(event.target.value);}}
            onKeyDown={handleKeyDown}
            value={nameQuery}
            placeholder={'Enter game name:'}
          ></input>
          <button 
            className='p-4 mb-4 bg-slate-700 text-white'
            onClick={() => {setGameSearchList([]); searchGames(nameQuery, setGameSearchList, setLoading)}}  
          >Get Games</button>

          {loading ? <motion.div key='motion-p' animate='visible' variants={loadingIcon} className='w-4'><AiOutlineLoading3Quarters className='text-white' /></motion.div> : <></>}

          <motion.div initial='hidden' animate='visible' exit='hidden' variants={list}>
          {gameSearchList.map((game, i) => {
            return (
              <motion.div layout key={game.id} custom={i} variants={item}>
                <GameListing gameName={game.names.international} gameLogo={game.assets.logo?.uri} gameID={game.id} setLoading={setLoading} setGameData={setGameData}/>
              </motion.div>
            )
          })}
          </motion.div>

          {
            gameData ?
            <GameDetail gameData={gameData} catIndex={catIndex} setCatIndex={setCatIndex}/>
            :
            <></>
          }
        </div>
        <div className='lg:w-[25%] md:w-[40%] w-[100vw] p-4 md:mt-auto mt-2 bg-slate-700'>
            {/* Ticker */}
            <h4>Latest Times:</h4>
            <motion.div key='latest-times-container' initial='hidden' animate='visible' exit='hidden' variants={list}>
              {
                newRunsList.map((run, i) => {
                  return (
                    <RunListing key={'latest-time-'+i} run={run} i={i}/>
                  )
                })
              }
            </motion.div>
          </div>
        
      </div>
    </AnimatePresence>      
    </main>
  )
}

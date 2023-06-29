import Image from 'next/image'
import { Inter, M_PLUS_1 } from 'next/font/google'
import axios from 'axios'
import {AnimatePresence, motion, stagger} from 'framer-motion'
import { useEffect, useState } from 'react'
import React from 'react'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'

import {getNewestRuns, searchGames, updateNewestRuns} from '../functions/api.js'
import {GameListing} from '../components/GameListing.js'

import {getAbrev, convertTime} from '../functions/helperfuncs.js'

const inter = Inter({ subsets: ['latin'] })

const list = {
  hidden: {
    opacity: 0, 
    transition: {
      when: 'afterChildren',
    }
  }, 
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
    }
  }
}

const item = {
  hidden: i => ({
    opacity: 0, 
    y:-10,
    transition: {
      duration: 1,
      delay: i * .1
    }
  }), 
  visible: i => ({
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      delay: i * .1
    }
  })
}

const loadingIcon = {
  visible: {
    opacity: 1,
    rotateZ: 360, 
    transition: {
      ease: 'linear',
      duration: 1,
      repeat: Infinity
    }
  }
}

export default function Home() {

  const [nameQuery, setNameQuery] = useState('');
  const [gameSearchList, setGameSearchList] = useState([]);
  const [newRunsList, setNewRunsList] = useState([]);
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(false);

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
    if (gameData)
      setGameSearchList([]);
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
      <div className='flex flex-wrap justify-between'>
        <div className='md:w-[50%] w-[100%]'>
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
            <motion.div key='detail-container' className='' initial='hidden' animate='visible' exit='hidden' variants={list}>
              {/* Game Header and Image */}
              <motion.h2 key='detail-h2' variants={item} className='md:text-4xl text-2xl md:pt-4 md:pb-4 pb-2'>{gameData.names.international}</motion.h2>
              <motion.div key='detail-div' variants={item}>
                <img className='md:max-h-[100%] max-h-[200px]' src={gameData.assets['cover-small'].uri}/>
              </motion.div>
              {/* Best Times Header */}
              <motion.h3 key='detail-runs-header' variants={item} className='md:text-3xl text-xl pt-6'>Best Times:</motion.h3>
              <motion.h3 key='detail-runs-subheader' variants={item} className='md:text-3xl text-xl pb-2'>&apos;{gameData.runs.category}&apos;</motion.h3>
              {/* List of Best Times */}
              <motion.ul key='detail-runs' variants={list} className=''>
                {gameData.runs.slice(0, 5).map((run, i) => {                  
                  console.log(run);
                  return(
                  <motion.li key={run.run.id} variants={item} className='text-white md:w-auto w-[100%] bg-slate-900 my-1 md:text-lg text-sm font-mono flex flex-wrap p-2'>
                    {
                      i < 3 
                      ? 
                      <img className='h-6 w-6 md:mr-[1.25rem] mr-[1rem]' src={'https://www.speedrun.com/images/' + getAbrev(i+1) + '.png'}></img>
                      :
                      <p className='md:mr-1 mr-2'>{getAbrev(i+1)}: </p>
                    }
                    <a className='mr-4 underline' href={run.run.weblink}>{convertTime(run.run.times.primary_t)}</a>
                    <div className='flex md:pl-0 pl-10'>
                      <p className='pr-2'>by:</p>
                      <motion.img key={run.player_image} src={run.player_image} variants={item} className='h-6 w-6'></motion.img>
                      <a className='ml-2 underline' href={run.player_link}>{run.player_name}</a>
                    </div>
                  </motion.li>
                  )
                })}
              </motion.ul>
            </motion.div>
            :
            <></>
          }
        </div>
          <div className='md:w-[45%] w-[100vw] p-4 md:mt-auto mt-2 bg-slate-700'>
            {/* Ticker */}
            <h4>Latest Times:</h4>
            <div>
              {
                newRunsList.map((run, i) => {
                  return(
                    <motion.li key={run.id} variants={item} className='text-white bg-slate-900 my-1 md:text-lg text-xs font-mono flex flex-wrap p-2 w-[100%]'>
                      <div className='flex w-[100%]'>
                        <p>{run.game_name}</p>
                      </div>
                      <div className='w-[100%]'>
                        <div className='flex mb-4'>
                          <a className='underline mr-4' href={run.weblink}>{convertTime(run.times.primary_t)}</a>
                          <p>&apos;{run.category_name}&apos;</p>
                        </div>
                        <div className='flex justify-between'>
                          <div className='flex'>
                            <p className='mr-1'>by:</p>
                            <motion.img key={run.player_image} src={run.player_image} variants={item} className='md:h-6 md:w-6 h-3 w-3 mr-1'></motion.img>
                            <a className='underline' href={run.player_link}>{run.player_name ? run.player_name : 'Unknown User'}</a>
                          </div>
                          <p>{run.seconds_since}</p>
                        </div>
                      </div>                      
                    </motion.li>
                    )
                })
              }
            </div>
          </div>
        
      </div>
    </AnimatePresence>      
    </main>
  )
}

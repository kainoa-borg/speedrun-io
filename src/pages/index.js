import Image from 'next/image'
import { Inter, M_PLUS_1 } from 'next/font/google'
import axios from 'axios'
import {AnimatePresence, motion, stagger} from 'framer-motion'
import { useEffect, useState } from 'react'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

const searchGames = (nameQuery, setGameSearchList, setLoading) => {
  console.log('searching...');
  setLoading(true);
  axios.get('https://www.speedrun.com/api/v1/games?name='+nameQuery).then((response) => {
    setGameSearchList(response.data.data);
    setLoading(false);
  }).catch((error) => {
    console.log(error);
    setLoading(false);
  })
}

const getGameDetails = (gameID, setGameData, setLoading) => {
  console.log('searching...')
  setLoading(true);
  axios.get('https://www.speedrun.com/api/v1/games/'+gameID+'').then((response_game) => {
    axios.get('https://www.speedrun.com/api/v1/games/'+gameID+'/records?miscellaneous=no&scope=full-game&top=50').then((response_runs) => {
      response_game.data.data['runs'] = response_runs.data.data[0].runs
      let cat = response_runs.data.data[0].runs[0].run.category;
      axios.get('https://www.speedrun.com/api/v1/categories/'+cat).then((response_cat) => {
        response_game.data.data['runs'].category = response_cat.data.data.name;
        setGameData(response_game.data.data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false)
      })
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    })
  }).catch((error) => {
    console.log(error);
    setLoading(false);
  })
}

const GameListing = (props) => {
  return (
    <div className='flex space-x-1 pb-2'>
      <h2 className='bg-slate-500 p-4 grow'>{props.gameName}</h2>
      <button className='bg-neutral-600 p-4 md:w-[25%] w-[30%]' onClick={() => {getGameDetails(props.gameID, props.setGameData, props.setLoading)}}>Get Details</button>
    </div>
  );
}

const convertTime = (time) => {
  let ms = String(Math.floor(time % 1 * 10));
  let s = String(Math.floor(time % 60));
  let m = String(Math.floor(time / 60));
  let h = String(Math.floor(time / 60 / 60));
  if (ms.length < 2) 
    ms = '0'+ms;
  if (s.length < 2) 
    s = '0'+s;
  if (m.length < 2) 
    m = '0'+m;
  if (h.length < 2) 
    h = '0'+h;
  return h + 'h:' + m + 'm:' + s + 's:' + ms + 'ms';
}

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
    opacity: 0, y:-10,
    transition: {
      duration: 1,
      delay: i * .1
    }
  }), 
  visible: i => ({
    opacity: 1, y: 0,
    transition: {
      duration: 1,
      delay: i * .1
    }
  })
}

export default function Home() {

  const [nameQuery, setNameQuery] = useState('');
  const [gameSearchList, setGameSearchList] = useState([]);
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nameQuery.length < 1) {
      setGameSearchList([]);
    }
  }, [nameQuery])

  useEffect(() => {
    if (gameSearchList.length > 0) {
      setGameData();
    }
  }, [gameSearchList])

  useEffect(() => {
    setGameSearchList([]);
  }, [gameData])

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
      <div className='flex'>
        <div className='md:w-[50%] w-[100%]'>
          <input 
            className='p-4 text-black'
            onChange={(event) => {setNameQuery(event.target.value);}}
            onKeyDown={handleKeyDown}
            value={nameQuery}
            placeholder={'Enter game name:'}
          ></input>
          <button 
            className='p-4 mb-4 bg-slate-500 text-white'
            onClick={() => {setGameSearchList([]); searchGames(nameQuery, setGameSearchList, setLoading)}}  
          >Get Games</button>

          {loading ? <div><motion.p key='motion-p' initial='hidden' animate='visible' exit='hidden' variants={item}>loading...</motion.p></div> : <></>}

          <motion.div initial='hidden' animate='visible' exit='hidden' variants={list}>
          {gameSearchList.map((game, i) => {
            return (
              <motion.div layout key={game.id} custom={i} variants={item}>
                <GameListing gameName={game.names.international} gameID={game.id} setLoading={setLoading} setGameData={setGameData}/>
              </motion.div>
            )
          })}
          </motion.div>

          {
            gameData ?
            <motion.div key='detail-container' className='' initial='hidden' animate='visible' exit='hidden' variants={list}>
              <motion.h2 key='detail-h2' variants={item} className='text-3xl pb-4'>{gameData.names.international}</motion.h2>
              <motion.div key='detail-div' variants={item}>
                <img src={gameData.assets['cover-small'].uri}/>
              </motion.div>
              <motion.h3 key='detail-runs-header' variants={item} className='text-2xl pt-6'>Best Times:</motion.h3>
              <motion.h3 key='detail-runs-header' variants={item} className='text-2xl pb-2'>"{gameData.runs.category}"</motion.h3>
              <motion.ul key='detail-runs' variants={list} className=''>
                {gameData.runs.slice(0, 5).map((run, i) => {
                  return(
                  <motion.li key={run.run.id} variants={item} className='text-white'>{i+1}: {convertTime(run.run.times.primary_t)}</motion.li>
                  )
                })}
              </motion.ul>
            </motion.div>
            :
            <></>
          }
        </div>
        <div className='md:w-[50%] w-[100%]'>

        </div>
      </div>
    </AnimatePresence>      
    </main>
  )
}

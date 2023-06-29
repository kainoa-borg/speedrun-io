import {list, item} from '../variants/variants.js'
import { motion } from 'framer-motion';
import { BestRunListing } from './BestRunListing.js';

export const GameDetail = (props) => {
    let gameData = props.gameData;
    let catIndex = props.catIndex;
    let setCatIndex = props.setCatIndex;
    return (
        <motion.div key='detail-container' className='' initial='hidden' animate='visible' exit='hidden' variants={list}>
            {/* Game Header and Image */}
            <motion.h2 key='detail-h2' variants={item} className='md:text-4xl text-2xl md:pt-4 md:pb-4 pb-2'>{gameData.names.international}</motion.h2>
            <motion.div key='detail-div' variants={item}>
                <img className='md:max-h-[100%] max-h-[200px]' src={gameData.assets['cover-small'].uri}/>
            </motion.div>
            {/* Best Times Header */}
            <motion.h3 key='detail-runs-header' variants={item} className='md:text-3xl text-xl pt-6'>Best Times:</motion.h3>
                <motion.div key='detail-runs-container' variants={list} className='flex wrap'>
                    {
                        gameData.categories.map((cat, key) => {
                            console.log(cat);
                            return (
                                <motion.button 
                                    key={'detail-runs-subheader' + key} 
                                    custom={key}
                                    variants={item} 
                                    className={catIndex == key ? 'bg-slate-500' : 'bg-slate-700'}
                                    onClick={() => {setCatIndex(key)}}  
                                >
                                    <h3 className='xl:p-3 p-2 xl:text-lg text-sm'>&apos;{cat.name}&apos;</h3>
                                </motion.button>
                            )
                        })
                    }
            </motion.div>

            {/* List of Best Times */}
            <motion.ul key='detail-runs' initial='hidden' animate='visible' exit='hidden' variants={list}>
                {gameData.categories[catIndex].runs.slice(0, 5).map((run, i) => {
                  return (
                    <motion.div key={'detail-runs-run'+i} custom={i} variants={item}>
                        <BestRunListing run={run} i={i}/>
                    </motion.div>
                  )
                })}
            </motion.ul>
        </motion.div>
    )
}
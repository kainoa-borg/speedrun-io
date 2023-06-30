import { motion } from "framer-motion"
import {list, item} from '../variants/variants.js'
import { getAbrev, convertTime } from "@/functions/helperfuncs.js";

export const RunListing = (props) => {
    let run = props.run;
    return(
        <motion.li key={run.id} custom={props.i} variants={item} className='text-white bg-slate-900 my-1 lg:text-lg md:text-md text-sm  font-mono flex flex-wrap p-2 w-[100%]'>
          <div className='flex justify-between w-[100%]'>
            <p className="">{run.game_name}</p>
            <img src={run.game_image} className="md:h-20 md:w-20 h-10 w-10 shrink-0"></img>
          </div>
          <div className='w-[100%]'>
            <div className='flex mt-2 mb-4'>
              <a className='underline mr-2' href={run.weblink}>{convertTime(run.times.primary_t)}</a>
              <p>&apos;{run.category_name}&apos;</p>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <p className='mr-1'>by:</p>
                 {
                    run.player_image
                    ?
                    <motion.img key={run.player_image} src={run.player_image} variants={item} className='md:h-6 md:w-6 h-3 w-3 mr-1'></motion.img>
                    :
                    <></>
                }
                <a className='underline' href={run.player_link}>{run.player_name ? run.player_name : 'Unknown User'}</a>
              </div>
              <p>{run.seconds_since}</p>
            </div>
          </div>                      
        </motion.li>
    )
}
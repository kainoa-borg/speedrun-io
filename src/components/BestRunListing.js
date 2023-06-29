import { motion } from "framer-motion";
import { getAbrev, convertTime } from "../functions/helperfuncs";
import {item} from '../variants/variants.js'

export const BestRunListing = (props) => {
    let run = props.run;
    let i = props.i;
    console.log(run);
    return(
        <motion.li key={run.run.id} custom={i} variants={item} className='text-white md:w-auto w-[100%] bg-slate-900 my-1 lg:text-xl md:text-lg text-md font-mono xl:flex flex-wrap p-2'>
          <div className="flex">
            {
                i < 3 
                ? 
                <img className='h-6 w-6 md:mr-[1.25rem] mr-[1rem]' src={'https://www.speedrun.com/images/' + getAbrev(i+1) + '.png'}></img>
                :
                <p className='md:mr-1 mr-2'>{getAbrev(i+1)}: </p>
            }
            <a className='mr-4 underline' href={run.run.weblink}>{convertTime(run.run.times.primary_t)}</a>
          </div>
          
          <div className='flex'>
            <p className='pr-2 pl-5'>by:</p>
            {
                run.player_image
                ?
                <motion.img key={run.player_image} src={run.player_image} variants={item} className='h-6 w-6'></motion.img>
                :
                <></>
            }
            <a className='underline' href={run.player_link}>{run.player_name}</a>
          </div>
        </motion.li>
    )
}
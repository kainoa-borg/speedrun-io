import {getGameDetails} from '../functions/api.js'

export const GameListing = (props) => {
    return (
      <div className='flex space-x-1 pb-2'>
        <h2 className='bg-slate-500 p-4 grow'>{props.gameName}</h2>
        <button className='bg-neutral-600 p-4 md:w-[25%] w-[30%]' onClick={() => {getGameDetails(props.gameID, props.setGameData, props.setLoading)}}>Get Details</button>
      </div>
    );
  }
  
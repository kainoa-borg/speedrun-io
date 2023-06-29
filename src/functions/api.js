import axios from 'axios';

export const searchGames = (nameQuery, setGameSearchList, setLoading) => {
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

const collectRunData = async(runIndex, response_runs, newRunsList, setNewRunsList) => {
    let gameID = response_runs.data.data[runIndex].game;
    let response_game = await axios.get('https://www.speedrun.com/api/v1/games/'+gameID+'')
    response_runs.data.data[runIndex].game_name = response_game.data.data.names.international;
    
    let categoryID = response_runs.data.data[runIndex].category;
    let response_category = await axios.get('https://www.speedrun.com/api/v1/categories/'+categoryID);
    response_runs.data.data[runIndex].category_name = response_category.data.data.name
    
    let userLink = response_runs.data.data[runIndex].players[0].uri;
    let response_user = await axios.get(userLink);
    response_runs.data.data[runIndex].player_image = response_user.data.data.assets.image.uri;
    response_runs.data.data[runIndex].player_name = response_user.data.data.names.international;
    response_runs.data.data[runIndex].player_link = response_user.data.data.weblink;

    let currentDateTime = new Date();
    let thisDateTime = new Date(response_runs.data.data[runIndex].submitted);
    let seconds_since = Math.floor((currentDateTime.getTime() - thisDateTime.getTime()) / 1000);
    if (seconds_since / 86400 > 1) {
        seconds_since = 'more than 1 day ago'
    }
    else if (seconds_since / 3600 > 1) {
        seconds_since = Math.floor(seconds_since / 3600) + ' hours ago';
    }
    else if (seconds_since / 60 > 1) {
        seconds_since = Math.floor(seconds_since / 60) + ' minutes ago';
    }
    else {
        seconds_since = 'just now';
    }
    response_runs.data.data[runIndex].seconds_since = seconds_since;

    return response_runs;

}

export const updateNewestRuns = async (newRunsList, setNewRunsList) => {
    console.log('getting new runs');
    let response_runs = await axios.get('https://www.speedrun.com/api/v1/runs?status=new&orderby=submitted&direction=desc');
    if (newRunsList.length > 0 && response_runs.data.data[0].id != newRunsList[0].id) {
        let response_runs_updated = await collectRunData(0, response_runs, newRunsList, setNewRunsList);

        setNewRunsList([response_runs_updated.data.data[0], ...runsList.slice(0, 10)]);
    }
}

export const getNewestRuns = async(newRunsList, setNewRunsList) => {
    console.log('getting new runs');
    let response_runs = await axios.get('https://www.speedrun.com/api/v1/runs?status=new&orderby=submitted&direction=desc');
    if (newRunsList.length < 1) {
        // setNewRunsList([response_runs.data.data[0]]);
        console.log('making list');
        for (let runIndex in response_runs.data.data.slice(0, 9)) {
            let response_runs_updated = await collectRunData(runIndex, response_runs, newRunsList, setNewRunsList);
            setNewRunsList(response_runs_updated.data.data.slice(0, 9));
        }
    }
}

export const getGameDetails = (gameID, setGameData, setLoading) => {
    console.log('searching...')
    setLoading(true);

    axios.get('https://www.speedrun.com/api/v1/games/'+gameID+'').then((response_game) => {

        axios.get('https://www.speedrun.com/api/v1/games/'+gameID+'/records?miscellaneous=no&scope=full-game&top=50').then((response_runs) => {
        
        response_game.data.data['runs'] = response_runs.data.data[0].runs
        let cat = response_runs.data.data[0].runs[0].run.category;
        
        axios.get('https://www.speedrun.com/api/v1/categories/'+cat).then((response_cat) => {
            
            response_game.data.data['runs'].category = response_cat.data.data.name;
            
            let runCount = 0;
            for (let runIndex in response_game.data.data['runs'].slice(0, 5)) {
                response_game.data.data.run_link = response_game.data.data['runs'][runIndex].run.weblink;
                // console.log(response_game.data.data['runs'][runIndex].run.weblink);
                axios.get(response_game.data.data['runs'][runIndex].run?.players[0].uri).then((response_player) => {
                    if (response_player.data.data.assets.image.uri)
                    response_game.data.data['runs'][runIndex].player_image = response_player.data.data.assets.image.uri;
                    else if (response_player.data.data.assets.icon.uri)
                    response_game.data.data['runs'][runIndex].player_image = response_player.data.data.assets.icon.uri;

                    response_game.data.data['runs'][runIndex].player_name = response_player.data.data.names.international ? response_player.data.data.names.international : response_player.data.data.names.japanese
                    response_game.data.data['runs'][runIndex].player_link = response_player.data.data.weblink;
                    if (runCount >= 4) {
                        setGameData(response_game.data.data);
                        setLoading(false);
                    }
                    runCount += 1;
                }).catch((error) => {
                    console.log(error);
                    setLoading(false);
                })
            }
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
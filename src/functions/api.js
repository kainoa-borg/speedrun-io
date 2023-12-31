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
    response_runs.data.data[runIndex].game_image = response_game.data.data.assets['cover-small'].uri;
    
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
    if (newRunsList?.length > 0 && response_runs.data.data[0].id != newRunsList[0].id) {
        let response_runs_updated = await collectRunData(0, response_runs, newRunsList, setNewRunsList);

        setNewRunsList([response_runs_updated.data.data[0], ...newRunsList.slice(0, 10)]);
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

export const getLeaderboardDetails = async (leaderboardData) => {            
    let runCount = 0;
    for (let runIndex in leaderboardData.data.data['runs'].slice(0, 5)) {
        leaderboardData.data.data.run_link = leaderboardData.data.data['runs'][runIndex].run.weblink;
        // console.log(leaderboardData.data.data['runs'][runIndex].run.weblink);
        axios.get(leaderboardData.data.data['runs'][runIndex].run?.players[0].uri).then((response_player) => {
            if (response_player.data.data.assets.image.uri)
            leaderboardData.data.data['runs'][runIndex].player_image = response_player.data.data.assets.image.uri;
            else if (response_player.data.data.assets.icon.uri)
            leaderboardData.data.data['runs'][runIndex].player_image = response_player.data.data.assets.icon.uri;

            leaderboardData.data.data['runs'][runIndex].player_name = response_player.data.data.names.international ? response_player.data.data.names.international : response_player.data.data.names.japanese
            leaderboardData.data.data['runs'][runIndex].player_link = response_player.data.data.weblink;
            if (runCount >= 4) {
                // setGameData(leaderboardData.data.data);
                // setLoading(false);
            }
            runCount += 1;
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }

    return leaderboardData;
}

export const getCategoryDetails = async (response_cat) => {
        let runs = {data: {data: {runs: []}}};
        if (response_cat.links.length == 6) {
            let leaderboardData = await axios.get(response_cat.links[5].uri);
            runs = await getLeaderboardDetails(leaderboardData);
        }
        else if (response_cat.links.length == 5) {
            let recordsData = await axios.get(response_cat.links[3].uri);
            for (let record in recordsData.data.data) {
                if (record?.category == response_cat.id) {
                    runs = await getLeaderboardDetails(record);
                    runs = runs.slice(0, runs.length > 10 ? 10 : runs.length);
                }
            }
        }
        let cat_data = {
            id: response_cat.id,
            name: response_cat.name,
            runs: runs.data.data.runs
        }

        return cat_data;
}

export const getGameDetails = async (gameID, setGameData, setLoading) => {
    console.log('searching...')
    setLoading(true);

    let response_game = await axios.get('https://www.speedrun.com/api/v1/games/'+gameID+'');

    let response_categories = await axios.get('https://www.speedrun.com/api/v1/games/'+gameID+'/categories');

    let categories = [];
    let catCount = response_categories.data.data.length;
    for (let catIndex in response_categories.data.data.slice(0, catCount > 5 ? 5: catCount.length)) {
        let response_cat = response_categories.data.data[catIndex]
        let cat = await getCategoryDetails(response_cat);
        if (cat.runs.length > 0) {
            categories.push(cat);            
        }
    }

    response_game.data.data.categories = categories;

    console.log(response_game.data.data);

    setGameData(response_game.data.data);
    setLoading(false);

    // response_game.data.data['runs'] = response_records.data.data[0].runs
    // let cat = response_records.data.data[0].runs[0].run.category;
        
    // getCategoryDetails(0, response_game);
}
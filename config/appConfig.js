define([
], function () {

    return {
        selectedCustomer: "nba",
        nba: {
            header: {
                title: 'NBA Player Stats',
                headerColor: '#E41A4C',
                mainMenuHeaderColor:'#E41A4C',
                textColor: 'white'
            },
            footer: {},
            mainMenu: [
                {
                    title: 'Players',
                    target: 'players',
                    url: '#players',
                    icon: 'fa fa-user'
                },
                {
                    title: 'Teams',
                    target: 'teams',
                    url: '#teams',
                    icon: 'fa fa-users'
                },
                {
                    title: 'Leaders',
                    target: 'leaders',
                    url: 'leaders',
                    icon: 'fa fa-star'
                },
                {
                    title: 'Games',
                    target: 'boxscores',
                    url: 'boxscores',
                    icon: 'fa fa-table'
                },
                {
                    title: 'Standings',
                    target: 'standings',
                    url: 'standings',
                    icon: 'fa fa-trophy'
                },
                {
                    title: 'Rookies',
                    target: 'rookies',
                    url: '#rookies',
                    icon: 'fa fa-child'
                },
                {
                    title: 'Compare',
                    target: 'compare',
                    url: '#compare',
                    icon: 'fa fa-line-chart'
                },
                {
                    title: 'Favorites',
                    target: 'favorites',
                    url: '#favorites',
                    icon: 'fa fa-heart'
                },
                {
                    title: 'Sortable',
                    target: 'sortable',
                    url: '#sortable',
                    icon: 'fa fa-sort'
                },
                {
                    title: 'Historical Players',
                    target: 'historical',
                    url: '#historical',
                    icon: 'fa fa-info-circle'
                }

            ],
            categories: [
                {
                    label: "Points",
                    value: "points"
                },
                {
                    label: "Rebounds",
                    value: "rebounds"
                },
                {
                    label: "Assists",
                    value: "assists"
                },
                {
                    label: "Blocks",
                    value: "blocks"
                },
                {
                    label: "Steals",
                    value: "steals"
                },
                {
                    label: "Turnovers",
                    value: "turnovers"
                },
                {
                    label: "Minutes",
                    value: "minutes"
                },
                {
                    label: "Efficiency",
                    value: "efficiency"
                },
                {
                    label: "Double Doubles",
                    value: "dd2"
                },
                {
                    label: "Triple Doubles",
                    value: "td3"
                },
                {
                    label: "Field Goal Pct.",
                    value: "fg_pct"
                },
                {
                    label: "3Pt Field Goal Pct.",
                    value: "fg3_pct"
                },
                {
                    label: "Free Throw Pct.",
                    value: "ft_pct"
                },
                {
                    label: "Personal Fouls",
                    value: "fouls"
                },
                {
                    label: "Assists per Turnover",
                    value: "assistsPerTurnover"
                },
                {
                    label: "Steals per Turnover",
                    value: "stealsPerTurnover"
                },
                {
                    label: "Plus/Minus",
                    value: "plusMinus"
                }
            ],
            gameLog: 'http://stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&PlayerOrTeam=T&Season=2015-16&SeasonType=Regular+Season&Sorter=PTS',
            gameLogPlayoff: 'http://stats.nba.com/stats/leaguegamelog?Counter=1000&Direction=DESC&LeagueID=00&PlayerOrTeam=T&Season=2015-16&SeasonType=Playoffs&Sorter=PTS',
            boxScore: 'http://stats.nba.com/stats/boxscore?GameID=0021500830&RangeType=0&StartPeriod=0&EndPeriod=0&StartRange=0&EndRange=0',
            rootIndex: 'http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=S&Season=2015-16&SeasonType=Regular+Season&StatCategory=PTS',
            rookieIndex: 'http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=Rookies&Season=2015-16&SeasonType=Regular+Season&StatCategory=PTS',
            rootIndexPlayoff: 'http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=S&Season=2015-16&SeasonType=Playoffs&StatCategory=PTS',
            rookieIndexPlayoff: 'http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=Rookies&Season=2015-16&SeasonType=Playoffs&StatCategory=PTS',
            allPlayersIndex: 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2015-16',
            teamsIndex: 'http://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=',
            playoffPicture: 'http://stats.nba.com/stats/playoffpicture?LeagueID=00&SeasonID=22015',
            playoffBracket: 'http://data.nba.com/data/json/cms/2015/playoffs_series/series_summary.json',
            playerSplits: 'http://stats.nba.com/stats/playerdashboardbygeneralsplits?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=201935&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&VsConference=&VsDivision=',
            playerGameLog: 'http://stats.nba.com/stats/playergamelog?DateFrom=&DateTo=&LeagueID=00&Season=2015-16&SeasonType=Regular+Season',
            advancedStats:'http://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight=',
            advancedStatsPlayoff:'http://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Playoffs&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight=',
            teamSortableStats:'http://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=',
            teamSortableStatsPlayoff: 'http://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Playoffs&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=',
            dataLoaded: false,
        }

    }
});

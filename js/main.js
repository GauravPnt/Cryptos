var fbstuff = {
    playerName: " ",
    score: 0,
    entry: 0,
    rank: 1,
    currscore: 0,
    picture: " "
};

var gameOptions = {
    gameHeight: 1334,
    backgroundColor: 0x08131a,
    gameWidth: 768
};

FBInstant.initializeAsync().then(function () {
    FBInstant.setLoadingProgress(100);
    FBInstant.startGameAsync().then(function () {
        fbstuff.playerName = FBInstant.player.getName();
        fbstuff.picture = FBInstant.player.getPhoto();
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        if (windowWidth > windowHeight) {
            windowWidth = windowHeight / 1.8;
        }
        var gameWidth = windowWidth * gameOptions.gameHeight / windowHeight;
        gameOptions.gameWidth = gameWidth;
        game = new Phaser.Game(gameWidth, gameOptions.gameHeight, Phaser.CANVAS);
        game.state.add("Boot", boot);
        game.state.add("Preload", preload);
        game.state.add("TitleScreen", titleScreen);
        game.state.add("PlayGame", playGame);
        game.state.add("leaderBoard", leaderboard);
        game.state.add("Submit", submit);
        game.state.start("Boot");
    })
})

//  function to call on boot 
var boot = function () { };
boot.prototype = {
    preload: function () {
        game.load.image("loading", "img/loading.png");
    },
    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.stage.backgroundColor = gameOptions.backgroundColor;
        game.state.start("Preload");
    }
}

//  preload data
var preload = function (game) { };
preload.prototype = {
    preload: function () {
        var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        game.load.setPreloadSprite(loadingBar);
        game.load.image("ProfilePic", fbstuff.picture);
        game.load.image("back", "img/back5.jpg");
        game.load.image("playbutton", "img/play.png");
        game.load.image("leader", "img/Leaderboard.png");
        game.load.image('font', 'img/font.png');
        game.load.image('home', 'img/Home.png');
        game.load.image('submit', 'img/Submit.png');

    },
    create: function () {
        FBInstant.getLeaderboardAsync('Score2')
        .then(function(leaderboard) {
        return leaderboard.setScoreAsync(00000);
        })
        .then(function(entry) {
            game.state.start("TitleScreen");
        });
    }
}

//  function to add backGround
function addImage() {
    game.add.image(-50, 0, 'back');
}

//  function for loading titleScreen
var titleScreen = function () { };
titleScreen.prototype = {
    create: function () {
        FBInstant.getLeaderboardAsync('Score2')
            .then(function (leaderboard) {
                return leaderboard.getPlayerEntryAsync();
            })
            .then(function (entry) {
                fbstuff.score = entry.getScore();
                fbstuff.rank = entry.getRank();
                addImage();
                var font = game.add.image(game.width / 2, 100, 'font');
                var text = game.add.text(game.width / 2, (100 + game.height / 2) / 2, fbstuff.playerName + "'s Score : " + fbstuff.score/1000 + '\n' +
                fbstuff.playerName + "'s Rank : " + fbstuff.rank, chart);
                text.anchor.set(0.5, 0);
                text.fontSize = 40;
                font.anchor.set(0.5, 0);
                font.scale.set(1.25);
                function startGame(){
                    game.state.start("PlayGame");
                }
                function leader(){
                    game.state.start("leaderBoard");
                }
                var playButton = game.add.button(game.width / 2, game.height / 2, "playbutton", startGame);
                playButton.anchor.set(0.5);
                playButton.scale.set(0.75);
                var leader = game.add.button(game.width / 2, 4 * game.height / 5, "leader", leader);
                leader.anchor.set(0.5, 0);
                leader.scale.set(1.1);
                var dp = game.add.image(game.width/2, 12.5*game.height/20, "ProfilePic");
                dp.width = 13*game.height/100;
                dp.height = 13*game.height/100;
                dp.anchor.set(0.5, 0);
                game.add.tween(playButton.scale).to({
                    x: 0.8,
                    y: 0.8
                }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
            });
    }
}

var chart = {
    font: 'bold 50pt Fira+Sans',
    fill: 'white',
    wordWrap: true,
    align: 'center',
    wordWrapWidth: gameOptions.gameWidth
}

//  main game
var playGame = function () { };
playGame.prototype = {
    val: 0,
    create: function () {
        addImage();
        game.add.plugin(PhaserInput.Plugin);
        var text = game.add.text(game.width / 2, game.height / 10, "Choose a number between 1 - 1000", chart);
        text.anchor.set(0.5, 0);
        text.wordWrapWidth = game.width;
        input = game.add.inputField(3*game.width/8, game.height / 3, {
            font: '36px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: game.width / 4,
            height: game.height / 30,
            padding: 8,
            borderWidth: 1,
            borderColor: '#1699F4',
            borderRadius: 6,
            placeHolder: 'Enter Here',
            type: PhaserInput.InputType.number,
            max: 1000,
        });
        var home = game.add.button(game.width / 2, 4.3 * game.height / 5, "home", this.home);
        home.scale.set(0.3, 0.3);
        home.anchor.set(0.5, 0.5);
        function set(){
            // console.log(input.value);
            fbstuff.entry = input.value;
            if(input.value==undefined||input.value==0)
                game.state.start("TitleScreen");
            else
                game.state.start("Submit");
        }
        var submit = game.add.button(game.width / 2,  game.height/2, "submit", set);
        val = input.value;
        submit.scale.set(0.6, 0.6);
        submit.anchor.set(0.5, 0.5);
    },
    home: function() {
        game.state.start("TitleScreen");
    },
}

//  leaderBoard stuff
var leaderboard = function() { };
leaderboard.prototype = {
    create: function () {
        addImage(game);
        var load = game.add.text(game.width/2, game.height / 2, "LOADING", chart);
        load.anchor.set(0.5, 0.5);
        game.add.tween(load.scale).to({
            x: 0.8,
            y: 0.8
        }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
        FBInstant.getLeaderboardAsync('Score2')
        .then(function(leaderboard) {
            return leaderboard.getEntriesAsync(5, 0);
        })
        .then(function(entries) {
            function homeScreen(){
                game.state.start("TitleScreen");
            }
            var home = game.add.button(game.width / 2, 4.3 * game.height / 5, "home", homeScreen);
            home.scale.set(0.3, 0.3);
            home.anchor.set(0.5, 0.5);
            var text = game.add.text(game.width / 2, game.height / 25, "LEADERBOARD", chart);
            text.wordWrap = false;
            text.anchor.set(0.5, 0.5);
            var rank = game.add.text(game.width/12, game.height / 10, "Rank", chart);
            rank.fontSize = 40;
            var name = game.add.text(5*game.width/12, game.height / 10, "Name", chart);
            name.fontSize = 40;
            var score = game.add.text(9*game.width/12, game.height / 10, "Score", chart);
            score.fontSize = 40;
            load.destroy();
            for(i=0; i<5&&i<entries.length; i++){
                var userrank = game.add.text(game.width/12, (i+2)*game.height / 10, entries[i].getRank(), chart);
                userrank.fontSize = 40;
                console.log(entries[i].getPlayer());
                var username = game.add.text(5*game.width/12, (i+2)*game.height / 10, entries[i].getPlayer().getName(), chart);
                username.fontSize = 40;
                var userscore = game.add.text(9*game.width/12, (i+2)*game.height / 10, entries[i].getScore()/1000, chart);
                userscore.fontSize = 40;
            }
        });
    }
}

//  submit data
var submit = function () { };
submit.prototype = {
    create: function () {
        addImage(game);
        var load = game.add.text(game.width/2, game.height / 2, "LOADING", chart);
        load.anchor.set(0.5, 0.5);
        game.add.tween(load.scale).to({
            x: 0.8,
            y: 0.8
        }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
        function start(){
            load.destroy();
        };
        FBInstant.getLeaderboardAsync('Sum')
            .then(function(leaderboard){
                return leaderboard.getEntriesAsync();
            })
            .then(function(entries) {
                var sum = 39811;
                // console.log(entries.length);
                // console.log(entries[0].getScore())
                if (entries.length>0)
                    sum = entries[0].getScore();
                var calc = parseFloat(fbstuff.entry) + parseFloat(sum);
                // console.log(calc);
                calavg(calc);
            }).catch(error => console.error(error));
        
        function calavg(calcsum){
            FBInstant.getLeaderboardAsync('Count')
            .then(leaderboard => leaderboard.getEntriesAsync(1, 0))
            .then(entries => {
                var count = 100;
                if (entries.length>0)
                    count = entries[0].getScore() + 1;
                var sum = calcsum;
                var avg = calcsum/count;
                avg = 2*avg/3;
                calcsum = Math.abs(parseFloat(fbstuff.entry) - avg);
                calcsum = 1000 - calcsum;
                calcsum = calcsum*10000;
                calcsum = Math.round(calcsum);
                fbstuff.currscore = calcsum/1000;
                console.log(calcsum, sum, count, avg);
                putscore(calcsum, sum, count);    
            }).catch(error => console.error(error));
        }
        function putscore(calcsum, sum, count){
            var tempsum = 0;
            var temprank = 0;
            FBInstant.getLeaderboardAsync('Score2')
            .then(function (leaderboard) {
                return leaderboard.setScoreAsync(calcsum);
            })
            .then(function (entry) {
                tempsum = entry.getScore()/1000;
                temprank = entry.getRank();
                FBInstant.getLeaderboardAsync('Sum')
                .then(function (leaderboard) {
                    return leaderboard.setScoreAsync(sum);
                })
                .then(function (entry) {
                    function homeScreen(){
                        game.state.start("TitleScreen");
                    }
                    // console.log(entry.getScore());
                        FBInstant.getLeaderboardAsync('Count')
                    .then(function (leaderboard) {
                        return leaderboard.setScoreAsync(count);
                    })
                    .then(function (entry) {
                        // console.log(entry.getScore());

                        var textScore = game.add.text(game.width / 2, game.height / 3,"Current Score : " + fbstuff.currscore 
                            + '\n' + "High Score : " + tempsum
                            + '\n' + "Global Rank : " + temprank , chart);
                        textScore.anchor.set(0.5, 0.5);
                        textScore.fontSize = 42;
                        var home = game.add.button(game.width / 2, 4.3 * game.height / 5, "home", homeScreen);
                        home.scale.set(0.3, 0.3);
                        home.anchor.set(0.5, 0.5);
                    });
                    // console.log(entry.getScore());
                    start();
                });   
            });
        }
    }
}
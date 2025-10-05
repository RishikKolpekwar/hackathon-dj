export const songs = [
    {
        id: '12', title: 'Just Dance', artist: 'Lady Gaga', duration: '4:01',
        albumCover: require('./images/Just_Dance_cover.png'), audioFile: require('./songs/Just Dance.mp3'),
        //postTransition: require('./songs/just dance to dynamite.mp3'),
        transitions:
            [
                {
                    //this one is good
                    TransitionTo: '17',
                    Name: 'Fire Wordplay',
                    Songs: 'Just Dance x Dynamite',
                    endTimethisSong: '1:41',
                    startTimeOtherSong: '0:14',
                    audioFile: require('./songs/just dance to dynamite.mp3'),
                },
                {
                    defaultTransition: true,
                    TransitionTo: 'ANY',
                    Name: 'Default Transition',
                    Songs: 'Just Dance x ANY',
                    endTimethisSong: '4:01',
                    startTimeOtherSong: '0:00',
                    audioFile: require('./songs/default-transition.mp3'),
                }
            ]

    },
    {
        id: '17', title: 'Dynamite', artist: 'Taio Cruz', duration: '3:22',
        albumCover: require('./images/dynamite.jpg'), audioFile: require('./songs/Dynamite.mp3'),
        //postTransition: require('./songs/dynamite to starships.MP3')
        transitions:
            [
                {
                    TransitionTo: '4',
                    Name: 'Clean lows switch',
                    Songs: 'Dynamite x Starships',
                    endTimethisSong: '1:22',
                    startTimeOtherSong: '2:02',
                    audioFile: require('./songs/dynamite to starships.MP3'),
                },
                {
                    defaultTransition: true,
                    TransitionTo: 'ANY',
                    Name: 'Default Transition',
                    Songs: 'Dynamite x ANY',
                    endTimethisSong: '3:22',
                    startTimeOtherSong: '0:00',
                    audioFile: require('./songs/default-transition.mp3'),
                }
            ]
    },
    {
        id: '4', title: 'Starships', artist: 'Nicki Minaj', duration: '3:30',
        albumCover: require('./images/starships.jpg'), audioFile: require('./songs/Starships.mp3'),
        //postTransition: require('./songs/starships to one more time.mp3')
        transitions:
            [
                {
                    TransitionTo: '7',
                    Name: 'ONEEEE MORE TIME WORDPLAY',
                    Songs: 'Starships x One More Time',
                    endTimethisSong: '2:48',
                    startTimeOtherSong: '0:10',
                    audioFile: require('./songs/starships to one more time.mp3'),
                },
                {
                    defaultTransition: true,
                    TransitionTo: 'ANY',
                    Name: 'Default Transition',
                    Songs: 'Starships x ANY',
                    endTimethisSong: '3:30',
                    startTimeOtherSong: '0:00',
                    audioFile: require('./songs/default-transition.mp3'),
                }
            ]
    },
    {
        id: '7', title: 'One More Time', artist: 'Daft Punk', duration: '5:20',
        albumCover: require('./images/one more time.jpg'), audioFile: require('./songs/One More Time.mp3'),
        transitions:
            [
                {
                    defaultTransition: true,
                    TransitionTo: 'ANY',
                    Name: 'Default Transition',
                    Songs: 'One More Time x ANY',
                    endTimethisSong: '5:20',
                    startTimeOtherSong: '0:00',
                    audioFile: require('./songs/default-transition.mp3'),
                }
            ]
    },
];



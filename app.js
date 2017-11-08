const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');9
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
const nedb = require('nedb');
const nedbService = require('feathers-nedb');
const favicon = require('serve-favicon');
const path = require('path')

// A Feathers app is the same as an Express app
const app = feathers();

const serveDir = path.join(__dirname, 'dist');

// Parse HTTP JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded params
app.use(bodyParser.urlencoded({ extended: true }));
// Register hooks module
app.configure(hooks());
// Add REST API support
app.configure(rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register a nicer error handler than the default Express one
app.use(handler());

//app.use(favicon(path.join(serveDir, 'favicon.ico')));

const liveDb = new nedb({
    filename: 'live.db',
    autoload: true
});
app.use('/api/live', nedbService({Model: liveDb, id: '_id'}));

const songsDb = new nedb({
    filename: 'songs.db',
    autoload: true
});
app.use('/api/songs', nedbService({Model: songsDb, id: '_id'}));

// Patch lyrics to lyrics1,2 if needed
let m = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    'c': 'chorus',
    't': 'chorus 2',
    'p': 'prechorus',
    'q': 'prechorus 2',
    'e': 'ending',
    'b': 'bridge',
    'w': 'bridge 2',
}
app.service('api/songs').find()
    .then(songs => {
        const separator = '=region 2=';
        let songsPatched = 0;
        let segments = {};
        for (song of songs) {
            if (!('order' in song)) {
                song['order'] = [];
                for (let s of song['sequence'].split(',')) {
                    if (s in m)
                        song['order'].push(m[s]);
                }
                delete song['sequence'];
                app.service('songs').update(song._id, song).then(s => {
                    console.log('Song patched: ', s.title_1);
                });
            }
            if (!('lyrics_1' in song)) {
                if (!song['lyrics'].includes('region 2')) {
                    song['lyrics_1'] = song['lyrics'];
                    song['lyrics_2'] = ''
                } else {
                    let lyrics = song['lyrics'].replace(/\[region 2\]/g, separator);
                    let re = new RegExp('\\n*\\[.*\\]\\n*', 'g');
                    let contents = lyrics.split(re).map(c => c.trim());
                    if (contents[0]) { // no tags
                        let split = contents[0].split(separator);
                        song['lyrics_1'] = split[0].trim();
                        song['lyrics_2'] = (split[1] || '').trim();
                    } else {
                        let types = lyrics.match(re).map(t => t.trim());
                        contents.splice(0, 1);
                        song['lyrics_1'] = song['lyrics_2'] = '';
                        for (let i = 0; i < types.length; i++) {
                            let split = contents[i].split(separator).map(c => c.trim());
                            split[1] = split[1] || '';
                            song['lyrics_1'] += types[i] + '\n' + split[0] + '\n';
                            song['lyrics_2'] += types[i] + '\n' + split[1] + '\n';
                        }
                    }
                }
                delete song['lyrics'];
                app.service('songs').update(song._id, song).then(s => {
                    console.log('Song patched: ', s.title_1);
                });
                songsPatched++;
            }
        }
        console.log(segments);
        console.log(songsPatched, 'songs patched.');
    });

const worshipsDb = new nedb({
    filename: 'worships.db',
    autoload: true
});
app.use('/api/worships', nedbService({Model: worshipsDb, id: '_id'}));

app.use(feathers.static(serveDir));

app.get('*', function(req, res) {
    res.sendFile(path.join(serveDir, 'index.html')); // load our public/index.html file
});
// Start the server
app.listen(process.env.port || 3030);

module.exports = app;
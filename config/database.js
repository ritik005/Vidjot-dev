if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb+srv://ritikv:ritik%4012345@cluster0-psglg.mongodb.net/test?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}
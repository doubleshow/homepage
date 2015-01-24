var Parser = require('parse-xlsx'),
    through2 = require('through2'),
    concat = require('concat-stream'),
    fs = require('fs')

var src = './data/cv.xlsx'

new Parser(src, 'publications')
    .recordStream
    .pipe(new through2.obj(function(chunk, enc, callback) {
        var record = JSON.parse(chunk)
        if ('authors' in record) {
            record['authors'] = record['authors'].replace(',', ';').split(';')

        }
        console.log(record)
        callback(null, record)
    }))
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/publications.json', JSON.stringify(data, null, ' '))
    }))

new Parser(src, 'grants')
    .recordStream
    .pipe(new through2.obj(function(chunk, enc, callback) {
        var record = JSON.parse(chunk)
        if ('authors' in record) {
            record['authors'] = record['authors'].replace(',', ';').split(';')

        }
        console.log(record)
        callback(null, record)
    }))
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/grants.json', JSON.stringify(data, null, ' '))
    }))    
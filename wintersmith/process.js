var Parser = require('parse-xlsx'),
    through2 = require('through2'),
    concat = require('concat-stream'),
    fs = require('fs')

var src = './data/cv.xlsx'


function toJson(){
	return new through2.obj(function(chunk, enc, callback) {
        var record = JSON.parse(chunk)        
        callback(null, record)
    })
}

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

new Parser(src, 'education')
    .recordStream
    .pipe(toJson())
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/education.json', JSON.stringify(data, null, ' '))
    }))    

new Parser(src, 'phd')
    .recordStream
    .pipe(toJson())
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/phd.json', JSON.stringify(data, null, ' '))
    }))      

new Parser(src, 'awards')
    .recordStream
    .pipe(toJson())
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/awards.json', JSON.stringify(data, null, ' '))
    }))  

new Parser(src, 'grants')
    .recordStream
    .pipe(toJson())
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/grants.json', JSON.stringify(data, null, ' '))
    }))    

new Parser(src, 'service')
    .recordStream
    .pipe(toJson())
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/service.json', JSON.stringify(data, null, ' '))
    }))        

new Parser(src, 'teaching')
    .recordStream
    .pipe(toJson())
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/teaching.json', JSON.stringify(data, null, ' '))
    }))            

new Parser(src, 'press')
    .recordStream
    .pipe(toJson())
    .pipe(concat(function(data) {
        fs.writeFileSync('contents/press.json', JSON.stringify(data, null, ' '))
    })) 
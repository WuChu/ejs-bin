var ejs = require('ejs');
var colors = require('colors');
var program = require('commander');
var path = require('path');
var co = require('co');
var fs = require('co-fs');
var mkdirp = require('mkdirp');

var list = function (val) {
    return val.split(',');
};

program.version('0.0.6')
    .usage('[options] <file ...>')
    .option('-c, --configs <items>', 'Config files', list)
    .option('-o, --output [dirname]', 'Output dirname')
    .option('-e, --extname [extname]', 'Output extname')
    .parse(process.argv);

// console.log(program.args);

var configFiles = program.configs || [];
var outputDir = program.output || './output';
var extname = program.extname || '.html';

co(function *() {
    console.log(`  Checking template files: ${'start ...'.green}`);
    var tStats = yield program.args.map((file)=>fs.stat(file));
    var templates = program.args.filter((file, i)=>tStats[i].isFile());
    console.log(`  Checking template files: ${'ok!'.green}`);

    console.log(`  Checking config files: ${'start ...'.green}`);
    var cStats = yield configFiles.map((file)=>fs.stat(file));
    var configs = configFiles.filter((file, i)=>cStats[i].isFile());
    console.log(`  Checking config files: ${'ok!'.green}`);

    console.log(`  Merging config datas: ${'start ...'.green}`);
    var configContents = yield configs.map((file)=>fs.readFile(file));
    var configData = configContents
        .map((buffer)=>JSON.parse(buffer.toString('utf-8')))
        .reduce((prev, next)=>Object.assign(prev, next));
    console.log(`  Merging config datas: ${'ok!'.green}`);

    console.log(`  Filling datas into templates: ${'start ...'.green}`);
    var templateContents = yield templates.map((file)=>fs.readFile(file));
    var templateContents = templateContents
        .map((buffer)=>ejs.render(buffer.toString('utf-8'), configData, {}));
    console.log(`  Filling datas into templates: ${'ok!'.green}`);

    console.log(`  Making output directory -> [${outputDir.red}]: ${'start ...'.green}`);
    mkdirp.sync(outputDir);
    console.log(`  Making output directory -> [${outputDir.red}]: ${'ok'.green}`);

    console.log(`  Writing files: ${'start ...'.green}`);
    var result = yield templates.map((file, i)=> {
        var target = path.join(outputDir, path.basename(file, '.ejs') + extname);
        fs.writeFile(target, templateContents[i]);
    });
    console.log(`  Writing files: ${'ok!'.green}`);

    // console.log(result);
}).catch(function (err) {
    console.log(err.stack)
});

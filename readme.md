# A simple CMD script for ejs

## Install
```
npm install ejs-bin -g
```

## Simple Shell
```
ejs-bin ./test/test.ejs -c ./test/data-a.json,./test/data-b.json -o ./output
```

## Helps
```
  Usage: ejs-bin [options] <file ...>

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -c, --configs <items>   Config files
    -o, --output [dirname]  Output dirname
    -e, --extname [extname]     Output extname
```

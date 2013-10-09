jsterm
======

Terminal emulator in browser!

Supported variables, output redirecting, colored output, themes, prompt-styles, etc..

Example:

    paulll@cloudx /user/desktop # var username paulll
    paulll@cloudx /user/desktop # pwd || echo hi, %username% at directory
    hi, paulll at directory /user/desktop
    paulll@cloudx /user/desktop # 

To add a command, create file in /rom/ and name is with command's name and .js extension

## Syntax

First word is command, other are arguments

    paulll@cloudx /user/desktop # echo something

Arguments separated by space, you can escape space and other lexemes with backslash or quotes

    paulll@cloudx /user/desktop # cd "/user/dir with spaces"
    /user/dir with spaces
    paulll@cloudx /user/dir with spaces # 

Command "var" sets value of variable.
Write variable name in percent symbols to get it's value

    paulll@cloudx /user/desktop # var username paulll
    paulll
    paulll@cloudx /user/desktop # echo hi, %username%
    hi, paulll

You can redirect output from one command to another with "||" lexeme

    paulll@cloudx /user/desktop # echo /var/www || cd
    /var/www
    paulll@cloudx /var/www #

Redirected element is always last in arguments list

    paulll@cloudx /user/desktop # pwd || echo you're at directory
    you're at directory /user/desktop
    
FS is not finished yet, so you can not redirect output to files. Words ">>", ">" and "&" are reserved

## Terminal API's

To register app in the terminal you have to set app[%commandname%] property with main app function
and manifest[%commandname%] with structure below

    {
        "async" : false, // start input on main function's return
        "help" : {
            "en-US" : "Short command description",
            // here you can add more languages 
        },
        "usage" : "somecommand (-flags) <important value> [not important]" // usage 
    }

Use API's listed below to write your own console app for jsterm

- util.console 
..- print (text, color, background, bold) - prints new line
..- write (text, color, background, bold) - writes text to last line
..- clear - clear terminal
..- read (prompt, key, callback) - read user input; key must be string; Support for ctrl-keys and enter ex. "CTRL+ENTER", "ENTER", "Q", "CTRL+Q";
..- clearline (line) - clear line
..- insertLine (line, text, color, background, bold) - insert line
- util.cursor
..- setPos (posX) - set X pos 
..- getPos (mode) - get cursor pos; mode can be 'line' or 'char' or undefined; if mode is undefined it returns object {line, char} 
..- hide () - hide cursor
..- show () - show cursor
- util.theme
..- promptStyle - config. 1 means, that prompt is in cloudx style, 2 - ubuntu, 3 - fedora;
..- color - colors. Please use this variables in your jsterm apps;
....- background - default: #242424 (dark gray)
....- error - default: #C75646 (light red)
....- info - default: #49D0FF (light blue)
....- prompt - default: #8EB33B (green)
....- text - default: #F7F7F7 (white/gray)
....- textBackground - default: transparent
- util.tdata
..- pwd - default: "/user/desktop" - working directory
..- system - default: "cloudx-3.3" - system
..- user - default: "paulll" - user name
....- warning

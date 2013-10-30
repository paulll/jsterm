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
    
FS is not finished yet, so you can not redirect output to files. Words <b>>></b>, <b>></b> and <b>&</b> are reserved

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
  - <b>print</b> (text, color, background, bold) - prints new line
  - <b>write</b> (text, color, background, bold) - writes text to last line
  - <b>clear</b> - clear terminal
  - <b>read</b> (prompt, key, callback) - read user input; on %key% press input stops; example: <i>CTRL+ENTER</i>, <i>ENTER</i>, <i>Q</i>;
  - <b>clearline</b> (line) - clear line
  - <b>insertLine</b> (line, text, color, background, bold) - insert line
- util.cursor
  - <b>setPos</b> (posX) - set X pos 
  - <b>getPos</b> (mode) - get cursor pos; mode can be 'line' or 'char' or undefined; if mode is undefined it returns object {line, char} 
  - <b>hide</b> () - hide cursor
  - <b>show</b> () - show cursor
- util.theme
  - <b>promptStyle</b> - config. 1 means, that prompt is in cloudx style, 2 - ubuntu, 3 - fedora;
  - <b>color</b> - colors. Please use this variables in your jsterm apps;
    - <b>background</b> - default: #242424 (dark gray)
    - <b>error</b> - default: #C75646 (light red) 
    - <b>info</b> - default: #49D0FF (light blue)
    - <b>prompt</b> - default: #8EB33B (green)
    - <b>text</b> - default: #F7F7F7 (white/gray)
    - <b>warning</b> - default: #FFB259 (orange)
    - <b>textBackground</b> - default: transparent
- util.tdata
  - <b>pwd</b> - default: "/user/desktop" - working directory
  - <b>system</b> - default: "cloudx-3.3" - system
  - <b>user</b> - default: "paulll" - user name

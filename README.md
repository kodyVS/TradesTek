# trades-tek-v1.0.0
![workorder](https://i.imgur.com/3dI0Hcx.png)
![workorder list](https://i.imgur.com/ibC9JT3.png)
![calendar](https://i.imgur.com/BxKlbY5.png)


## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve for main DB
npm run serve:test for test DB
```

### Extra Information

Times may be messed up for you on the time in and out feature as I hard coded my timezone. Adjust this line to fix : ./views/TimeManager.vue line 150 and 188 and change the number of hours subtracted for UTC time.

Employees are normally made in quickbooks and then imported into this app.

I use better comments vs-code extension for commenting

if you could use //chris for all your comments I will make them red so I can see your comments easier.

If some of the Capitalization seems weird, all the Models are stored in capitals because they match the structure that quickbooks uses


Extensions I use in this project are
Auto Close Tag
Babel Javascript
Better Comments
Bracket Pair Colorizer 2
Color Highlight
ESLint
Image Preview
Material Icns theme
NPM Intellisense
Prettier - code formatter
TabNine
Vue
vuetify-vscode

My better comments settings file looks like this
{
"tag": "!",
"color": "#FF2D00",
"strikethrough": false,
"underline": false,
"backgroundColor": "transparent",
"bold": false,
"italic": false
},
{
"tag": "?",
"color": "#3498DB",
"strikethrough": false,
"underline": false,
"backgroundColor": "transparent",
"bold": false,
"italic": false
},
{
"tag": "//",
"color": "#474747",
"strikethrough": true,
"underline": false,
"backgroundColor": "transparent",
"bold": false,
"italic": false
},
{
"tag": "todo",
"color": "#FF8C00",
"strikethrough": false,
"underline": false,
"backgroundColor": "transparent",
"bold": false,
"italic": false
},
{
"tag": "\*",
"color": "#2EFF00",
"strikethrough": false,
"underline": false,
"backgroundColor": "transparent",
"bold": false,
"italic": false
},
{
"tag": "fix",
"color": "#CB1367",
"strikethrough": false,
"underline": false,
"backgroundColor": "transparent",
"bold": false,
"italic": false
},
{
"tag": "chris",
"color": "#FF003E",
"strikethrough": false,
"underline": false,
"backgroundColor": "transparent",
"bold": false,
"italic": false
}

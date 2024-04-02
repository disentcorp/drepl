# DREPL

## [Disent](https://www.disent.com) [REPL](https://repl.disent.com) widget

Widget to put mini python cells in your docs, webpages, whatnot.

Current version supports `python` for RCE (remote code execution) on [`repl.disent.com`](https://repl.disent.com) using our sandbox. `bash` has a theme but no RCE. Maybe we add more? Let us know.

<br/> 

**Feedback please**

- repl@disent.com
- https://discord.gg/PFQxJMm4Kb

## Install

```bash
bash$ yarn add drepl 
```

## Use

```jsx
import { Repl } from 'drepl';
<Repl defaultInput={"print(\"Hello World!\")"} />
```

![Hello World](https://github.com/disentcorp/drepl/blob/main/src/lib/components/assets/helloworld.png "Hello World")

^ this a picture, github doesn't allow embedded widgets 😔 (@github [📧 us](mailto://repl@disent.com) we can help with that!)

## Props

|prop|default|description|
|-|-|-|
`replURI`|`"https://repl.disent.com"`|REPL server|
`defaultInput`|`""`|initial input next to prompt|
`defaultOutput`|`""`|inital output to display|
`imports`|`""`|code you don't want user to see, like imports|
`disabled`|`false`|disables user interactivity, shows default input/output|
`multiLine`|`false`|vertical mode|
`language`|`"python"`|also have `"bash"` (doesn't execute)|
`width` |`"525px"`|width|
`height`|`"225px"`|height (only if `multiLine=true`)|
`inputRatio`|`40`|% input to output|
`runOnLoad`|`true`|run on initial page load|


## Pure JS/HTML way

For the props above just add as data-* tags on the <div> below

```js
<div class="disent-embed" data-defaultinput='print("Hello World")'></div>
<script type='text/javascript' src="http://repl.disent.com/drepl.js" async></script>
```
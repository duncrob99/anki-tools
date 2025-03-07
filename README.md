# anki-tools

To use, clone the repository somewhere. Then, if you are on Linux, run linker.sh to create symlinks from the Anki media folder to each of the files in this repository. If you are on a different operating system, you'll have to create the links yourself.

Then you will be able to import them from Anki cards like so:

```html
<link rel="stylesheet" href="_duncrob99-anki-tools-prettify.css" />
<script src="_duncrob99-anki-tools-storage.js"></script>
```

## input-verifier

This ensures that the input (from {{type:}} substitutions) follows a certain validation scheme. It provides one global function, setupInputVerification, which takes a function as its argument which takes the value of the input and returns a boolean of whether said input is valid.

When the input is invalid, it prevents the default action on enter, meaning the user can't answer the card without selecting "show answer" with the mouse, and allso adds the class 'invalid' to the input. It includes debouncing of 1s for the class, i.e. the input has to be invalid for a whole second before it visually shows as invalid.

```js
<script src="_duncrob99-anki-tools-input-verifier.js"></script>
<script>
	window.setupInputVerification(val => !val.match(/[^\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]/u));
</script>
```

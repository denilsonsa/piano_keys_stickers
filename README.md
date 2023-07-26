# Piano keys stickers

[Donation - buy me a coffee](https://denilson.sa.nom.br/donate.html)

This tool generates "stickers" that you can print, cut, and put on top of your
piano keys to help you play. It's useful for beginners, or for anyone who isn't
a professional musician yet.

Try it live: <https://denilsonsa.github.io/piano_keys_stickers/stickers.html>

## Inspiration

There are some sticker sets on the market, mostly manufactured from China.
There are two main types:

* Actual stickers with actual glue that you permanently place on your keys.
* A strip of silicone (or some other material) cut in a special format, so that
you can lay it over the top of the keys. Even though they are not strictly
stickers, they are still called that because that's what people search for.

The second kind inspired me to build this tool. I can't know if the
(pseudo-)stickers will fit my keys until I spend money buying them. I can't
know if the print on them will have all the information I want (because their
listings have multiple photos of different designs, and you never know which
one you're going to get). And if they tear apart, I can't easily fix them.

Thus, this tool was born! It is very configurable and lets me print the
stickers for the exact size I need, with the exact information and layout I
want.

## How to use this tool

1. **Measure** your keys, both the black keys and the white keys. How wide are
   they?
2. Select **how many keys** you have, or manually insert the first and the last
   note.
3. **Measure** the total width of your keyboard. Does it match the total width
   calculated by the tool? If it doesn't, you should review the previous
   measurements.
4. Choose the desired **height** for the stickers.
    * A thin black-key height may fit in the space between your black key and
      the base of the piano, but it can be more fragile.
    * Make sure the height of the white keys is short enough so the stickers
      won't get in the way.
5. This is already good enough. Feel free to **print**.
    * You may want to print on a thicker sheet of paper.
    * You may want to select the landscape paper orientation.
    * Please set "Scale = 100%" when printing, otherwise the dimensions will be
      wrong.
    * Please remember to enable colors and backgrounds while printing.
6. Now grab some scissors and cut the paper.
    * You can also fold the top part backwards (follow the dashed line).
    * You can optionally put a long strip of transparent tape along the top of
      the paper to prevent it from tearing.
7. Place the finished product on top of your keyboard.

There are more configuration options if you really want to tweak the look of
your own stickers. They are self-explanatory, and you're free to explore.

## Features

* Do, Re, Mi Fa, Sol, La, Si ([Solfège](https://en.wikipedia.org/wiki/Solf%C3%A8ge)) note names
* Alternative names for some notes (e.g. Si or Ti)
* C, D, E, F, G, A, B note names
* Octave numbers, forming [scientific/international pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
* [Boomwhacker color codes](https://github.com/nicolasbrailo/PianOli/pull/53)
* Flat (bemolle) ♭ and sharp ♯ symbols for the notes that can have such symbols
* Musical staff with 𝄞 and 𝄢 clefs
* MIDI note number for each white key
* [Frequency (in Hz) for each key](https://en.wikipedia.org/wiki/Piano_key_frequencies), both black and white
* Instant feedback, you immediately see the effects of changing any configuration option
* Client-side, runs in the browser, no server required

It also has the following dubious features (anti-features?):

* Uses the browser to print, which means it suffers from all issues related to printing from the browser (e.g. are you sure it will be printed in the correct dimensions?)
* Uses [millimeters](https://en.wikipedia.org/wiki/International_System_of_Units) for dimensions, without any option to change units
* Uses [Vue.js 3 directly from CDN](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn), no build steps required
* Uses ES modules, which means [this tool doesn't work over `file://`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_standard_scripts), always requiring a basic webserver

## TODO

Visual stuff/fluff:

* [ ] Revisit and improve the layout of the white keys. It's currently too messy and buggy.
    * To be done whenever I add more customization options (such as font sizes and families).
* [x] Possibly rewrite the whole thing to generate one giant SVG file (instead of relying on HTML+CSS).
    * Too much work for little benefit.
* [ ] Add more configuration options to let the user change the dimensions of each element (Solfège, color, staff, letters, frequency).

Print-related stuff:

* [ ] Let the user break the long strip into smaller printable sections (with extra keys to be overlapped while gluing together).
* [ ] Prepare a print preview layout, something that looks like a piece of paper. Also needs support for multiple paper sizes.
* [ ] Add a toggle for "print test mode" that would print the layout in a ink-saving way. Good to test the size before printing the full stickers. All the contents of the sticker will be hidden (except for one key), and the black keys would be white. Optionally, multiple keys can be printed, but with different sizes (so the user can decide the best size).
* [ ] Add a "Print!" button.
* [ ] Add a ruler to help calibrating the print. This lets the user quickly check if the printed size matches a real-world ruler.

Extra layer of polish:

* [ ] Add some instructions and photos of printing, cutting, putting some tape for extra strength, etc. Not only it instructs people on how to use the tool, but it also shows the end result. Also add a screenshot of the tool to the README.
* [ ] Add a favicon.
* [ ] Use [Web MIDI](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) to detect the key range, and possibly highlight them live.
* [ ] Add buttons to shift the whole strip one octave up or down (add/subtract 12 from both `min_note_code` and `max_note_code`). Useful for printing new guides for keyboards that can shift one octave up or down.
* [ ] Improve the usability of the form. I literally spent zero effort in making it prettier, and it looks very ugly and scary.

Extra music stuff:

* [ ] Let the user pick one clef to be used for the whole strip. Treble, Bass, Alto, and even the other not-so-common clefs.
* [ ] Let the user choose a key signature (extra ♭ or ♯ symbols after the clef), adapting the notes as needed.
    * Good luck fitting the key signature in the very limited width. Maybe replace the middle C note with the wide signature.
    * Have to figure out how to display the displaced notes. Maybe just add the ♮ natural symbol.
    * Might require a lot of refactoring of `note.js` for deeper understanding of music.

## License

The code is licensed under a [very permissive](https://en.wikipedia.org/wiki/Permissive_software_license) [MIT license](LICENSE).

The images are either Public Domain or Creative Commons, please check each image for details.

## Pricing and donations

This tool is provided for free for anyone to use. And it is also [free software](https://en.wikipedia.org/wiki/Free_software) (as in [freedom](https://en.wikipedia.org/wiki/The_Free_Software_Definition)).

If you think this tool helped you, saved you time, or saved you money; feel free to send a [donation](https://denilson.sa.nom.br/donate.html). Let's say… maybe you were willing to buy some stickers of dubious quality from some website, but instead you decided to use this tool. Instead of spending the money on that website, you could send me a small donation. Or maybe you're a music shop and you've decided to print and sell the stickers generated from this tool. If you're earning money from this tool, it would be nice to donate a little bit to the author(s). Still, donations are voluntary, you don't have to donate if you don't want to.

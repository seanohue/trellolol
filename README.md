##TrelloLOL

...What?

###Trello JSON to Readable Markdown Converter

Oh, okay.

####So how do I use it?

- Install via `npm install -g` in this directory, or `npm install -g trellolol` once it's actually published.
- Go to your project's Trello board and click on the menu on the right hand side.
- Go to 'Print and Export'.
- Export the JSON and put it in a .json file locally.
- In terminal, enter something like `trellolol input.json output.md "Adding game features"`.
- Trellolol will print the output to terminal and write it to `output.md`.
- Profit?

####I still don't get it.

Usage: `trellolol <input json file> <output md file> [optional trello list name to render. defaults to "Done"]`

See the examples directory for an example input/output. The main use case for this, as I see it now, is to quickly create an easily editable changelog/release notes for a project. I am sure it has other uses. If you want features or find a horrific bug (there's very little error handling), please submit an issue.

![trellolol](./Troll-face.sh.png)

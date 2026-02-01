
# CLI Cheatsheet

## Password Manager `pass`

- `pass insert service/user` add credentials to password store
- `pass service/user` display credentials from password store

## Terminal `fish`

- `fish_config` open fish configuration

## Windows Manager `sway`

- `Mod + enter` open terminal
- `Mod + e` open file explorer
- `Mod + d` open launcher
- `Mod + Shift + q` close window
- `Mod + Shift + c` reload sway config
- `Mod + Shift + e` exit sway
- `Mod + r` resize window
- `Mod + Shift + space` floating window
- `Mod + 1 - 9` new workspace
- `Mod + Shift + -` move window into scratchpad
- `Mod + -` take window out of scratchpad

## Mind Mapper `h-m-m`

- `enter` create a new sibling to the active node
- `tab` create a new child for the active node
- `y` copy active node and descendants
- `d` cut active node and descendants
- `p` paste as descendants of the active node
- `P` paste as siblings of the active node
- `i` insert text to active node
- `I` overwrite text in active node
- `u` undo
- `c` center active node on screen
- `s/S` save existing/ save new
- `q` quit
- `?` show commands

## Terminal Multiplexer `tmux`

- `Ctrl + b` prefix key
- `Ctrl + b, c` create window
- `Ctrl + b, n` next window
- `Ctrl + b, p` previous window
- `Ctrl + b, ,` rename window
- `Ctrl + b, w` list windows
- `Ctrl + b, %` split window vertically
- `Ctrl + b, "` split window horizontally
- `Ctrl + b, arrow key` move between panes
- `left mouse + drag` move pane boundary
- `Ctrl + b, x` kill pane
- `Ctrl + b, d` detach session

## Tmux Layout Manager `tmuxifier`

- `tmuxifier new sessionname` create new session
- `tmuxifier load sessionname` load session
- `tmuxifier edit sessionname` edit session

## Development Environment/ Text Editor `nvim`

### Vim

- `:e filename` open file
- `:w` save file
- `:q` close file
- `:wq` save and close file
- `:q!` close file without saving
- `:e!` reload file
- `u` undo
- `Ctrl + r` redo
- `yy` copy line
- `dd` cut line
- `p` paste line
- `/string` search for string
- `n` next search result
- `N` previous search result
- `:%s/old/new/g` replace old with new

### Telescope

- `Ctrl + f` find files
- `Ctrl + g` find string
- `Ctrl + b` find buffers
- `:Telescope help` display help
- `:Telescope find_files` find files
- `:Telescope commands` find commands

### NERDTree

- `:NERDTreeToggle` toggle file explorer
- `:NERDTreeFind` find file in tree
- `R` refresh tree
- `m` open file menu
- `o` open file
- `t` open file in new tab
- `i` open file in split
- `s` open file in vsplit
- `p` go to parent directory
- `P` go to root directory
- `?` display help
- `q` close tree

### Copilot

- `Ctrl + j` select next completion
- `Ctrl + e` close completion
- `Ctrl + y` confirm completion
- `:Copilot auth` authorise Copilot using GitHub
- `:Copilot setup` setup Copilot
- `:Copilot status` display Copilot status
- `:Copilot panel` show first 10 suggestions

### Mason

- `i` install package
- `u` update package
- `:Mason` toggle Mason
- `:MasonUpdate` update packages
- `:MasonInstallAll` re-install all packages

### Lazy

- `:Lazy` toggle Lazy package manager

### Nvchad

- `Space` display shortcuts
- `Space, c, h` display cheat sheet
- `Space, f, f` find files
- `Space + h` open horizontal terminal
- `Ctrl + n` (nvimtree) toggle file explorer
- `-` (nvimtree) navigate up one level of directory
- `backspace` (nvimtree) close folder
- `:Nvdash` display dashboard
- `:Nvcheatsheet` display cheat sheet
- `:NvuiToggle` toggle UI
- `:NvuiClose` close UI
- `:NvuiResize` resize UI
- `:NvuiMove` move UI

### Terminal

- `:term` open terminal in new tab
- `:term <command>` open terminal in new tab (and execute bash command)

## File Browser `ranger`

- `h` move left
- `j` move down
- `k` move up
- `l` move right
- `yy` copy file
- `dd` cut file
- `pp` paste file
- `Ctrl + x` open file
- `Ctrl + r` rename file
- `Ctrl + d` create directory
- `Ctrl + u` toggle hidden files
- `Ctrl + p` preview file
- `Ctrl + h` show help

## Knowledge Base `joplin`

- `Ctrl + n` new note
- `Ctrl + s` save note
- `Ctrl + o` open note
- `Ctrl + e` edit note
- `Ctrl + d` delete note

## System Monitor `htop`

## Cloud Storage `gdrive`

- `gdrive list` list files
- `gdrive upload filename` upload file
- `gdrive download fileid` download file
- `gdrive delete fileid` delete file

## Non-Web Browser `bombadillo`

- `gemini://geminiprotocol.net:1965/` Main project page for Project Gemini
- `gopher://i-logout.cz/1/bongusta/` Content Aggregator for gopherspace
- `gopher://gopher.floodgap.com/1/gemini` Floodgap Systems Gemini Server

## Plasma Configuration `konsave`

- `konsave -s` save current configuration
- `konsave -l` load saved configuration

## Launcher `rofi`

- `rofi -show run` run command
- `rofi -show drun` open application
- `rofi -show window` switch window
- `rofi -show ssh` connect to server

## RSS reader `newsboat`

## Weather Monitor `wttr.in`

- `curl wttr.in/Peterborough?1nF` weather for today
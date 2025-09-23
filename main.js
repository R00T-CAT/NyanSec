const terminal = document.getElementById('terminal');
const plain = document.getElementById('plain');
const toggleBtn = document.getElementById('toggleBtn');
const transitionScreen = document.getElementById('transition-screen');

// --------------------------
// COMMANDS OBJECT
// --------------------------
const commands = {
  help: `
Available commands:
<ul>
  <li>help - Show available commands</li>
  <li>about - About me</li>
  <li>projects - View my projects</li>
  <li>contact - Contact info</li>
  <li>clear - Clear the terminal</li>
  <li>pet - Pet the kitty</li>
  <li>meow - Hear a meow</li>
  <li>catfact - Get a random cat fact</li>
  <li>nyan - Nyan Cat!</li>
  <li>joke - Get a random joke</li>
  <li>echo [text] - Repeat your text</li>
  <li>neofetch - Show NyanSec OS info</li>
  <li>gui - Switch to GUI mode</li>
  <li>terminal - Switch to Terminal mode</li>
  <li>goto [page] - Open an approved page</li>
</ul>`,
  about: `Hi nya, I'm R00T-CAT — a Coder that codes.`,
  pet: 'Purr~ thanks nya',
  meow: 'Meow!',
  nyan: '<span style="color:magenta;">~=[,,_,,]:3 Nyan Nyan Nyan!</span>',
  projects: `1. <a href="https://null" target="_blank" rel="noopener noreferrer">Under Catstruction</a>`,
  contact: `Email: <a href="mailto:root.cat.sec@gmail.com">root.cat.sec@gmail.com</a><br>
GitHub: <a href="https://github.com/R00T-CAT" target="_blank" rel="noopener noreferrer">github.com</a>`,
  clear: '',
  catfact: [
    "Cats have five toes on their front paws, but only four on the back.",
    "A group of cats is called a clowder.",
    "Cats sleep for 70% of their lives.",
    "The oldest known pet cat existed 9,500 years ago.",
    "Cats can rotate their ears 180 degrees."
  ],
  joke: [
    "Why don’t cats play poker in the jungle? Too many cheetahs!",
    "What do you call a pile of kittens? A meowtain.",
    "Why was the cat sitting on the computer? To keep an eye on the mouse!"
  ],
  neofetch: `<pre style="color:#00ff00;">
      ／＞　 フ
     | 　_　_|   NyanSec OS v1.0
   ／` + "`" + ` ミ＿xノ   -----------------
  /　　　　 |
 /　 ヽ　　 ﾉ  User: rootcat
 │　　|　|　|  Host: Catputer
／￣|　　 |　|  Kernel: NyanCat 5.2
(￣ヽ＿_ヽ_)_) Shell: /bin/nya
＼二　　　　 |
    ─────────────
    Theme: Catboy Night
    Wallpaper: Catboy
    Terminal: HTML5
    Packages: 1337 (meow)
    Uptime: 9 lives
</pre>`,
  gui: "Switching to GUI mode...",
  terminal: "Switching to Terminal mode..."
};

// --------------------------
// SAFE REDIRECTION LOGIC
// --------------------------
const allowedGotoPages = {
  github: "https://github.com/R00T-CAT",
};

// --------------------------
// TERMINAL MODE VARIABLES & FUNCTIONS
// --------------------------
let history = [];
let historyIndex = -1;

// Create a new prompt line in the terminal
function createPrompt() {
  const promptLine = document.createElement('div');
  promptLine.className = 'prompt-line';
  const prompt = document.createElement('span');
  prompt.className = 'prompt';
  prompt.textContent = '$';
  const input = document.createElement('input');
  input.autofocus = true;
  promptLine.appendChild(prompt);
  promptLine.appendChild(input);
  terminal.appendChild(promptLine);
  input.focus();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim();
      terminal.removeChild(promptLine);
      runCommand(command);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (history.length > 0 && historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        input.value = '';
      }
    }
  });
}

// Handle terminal commands in terminal mode
function runCommand(cmd) {
  if (cmd !== '') history.push(cmd);
  historyIndex = history.length;
  const line = document.createElement('div');
  line.className = 'output-line';
  line.textContent = `$ ${cmd}`;
  terminal.appendChild(line);

  let output = document.createElement('div');
  output.className = 'output-line';

  if (cmd === 'clear') {
    terminal.innerHTML = '';
    createPrompt();
    terminal.scrollTop = terminal.scrollHeight;
    return;
  } else if (cmd === 'catfact') {
    const facts = commands.catfact;
    output.textContent = facts[Math.floor(Math.random() * facts.length)];
  } else if (cmd === 'joke') {
    const jokes = commands.joke;
    output.textContent = jokes[Math.floor(Math.random() * jokes.length)];
  } else if (cmd.startsWith('echo ')) {
    output.textContent = cmd.slice(5);
  } else if (cmd === 'neofetch') {
    output.innerHTML = commands.neofetch;
  } else if (cmd === 'gui') {
    output.textContent = commands.gui;
    terminal.appendChild(output);
    setTimeout(() => {
      typeTransition([
        { text: 'Initializing build environment...' },
        { text: 'Compiling UI components...' },
        { text: 'Deploying to GUI layer...' },
        { text: 'Warning: UI renderer failed to initialize.', error: true, pause: 2000 },
        { text: 'Attempting fallback...' },
        { text: 'Fallback renderer loaded.' },
        { text: 'Launching graphical interface...' }
      ], () => {
        terminal.style.display = 'none';
        plain.style.display = 'block';
        toggleBtn.textContent = 'Switch to Terminal Mode';
        setTimeout(() => {
          if (terminal.style.display === 'block') createPrompt();
        }, 100);
      });
    }, 500);
    return;
  } else if (cmd === 'terminal') {
    output.textContent = commands.terminal;
    terminal.appendChild(output);
    setTimeout(() => {
      typeTransition([
        { text: 'Shutting down GUI...' },
        { text: 'Restoring shell session...' },
        { text: 'Booting terminal interface...' }
      ], () => {
        plain.style.display = 'none';
        terminal.style.display = 'block';
        toggleBtn.textContent = 'Switch to Plain Mode';
        createPrompt();
      });
    }, 500);
    return;
  } else if (cmd.startsWith('goto ')) {
    // SAFE REDIRECTION
    const page = cmd.slice(5).trim().toLowerCase();
    if (allowedGotoPages[page]) {
      window.location.href = allowedGotoPages[page];
    } else {
      output.textContent = "Invalid or unsafe redirect. Allowed: Github";
    }
  } else if (commands[cmd]) {
    output.innerHTML = commands[cmd];
  } else {
    output.innerHTML = `${cmd} is not recognized as a command. Type 'help' for options.`;
  }
  terminal.appendChild(output);
  createPrompt();
  terminal.scrollTop = terminal.scrollHeight;
}

// --------------------------
// TRANSITION ANIMATION FUNCTION
// --------------------------
function typeTransition(lines, callback, delay = 350) {
  transitionScreen.innerHTML = '';
  transitionScreen.style.display = 'flex';
  let i = 0;
  function nextLine() {
    if (i < lines.length) {
      let line = document.createElement('div');
      line.innerHTML = lines[i].text;
      if (lines[i].error) line.classList.add('error');
      transitionScreen.appendChild(line);
      i++;
      setTimeout(nextLine, lines[i - 1].pause || delay);
    } else {
      setTimeout(() => {
        transitionScreen.style.display = 'none';
        callback();
      }, 500);
    }
  }
  nextLine();
}

// --------------------------
// TOGGLE BUTTON (GUI/TERMINAL SWITCH)
// --------------------------
toggleBtn.addEventListener('click', () => {
  const toPlain = terminal.style.display !== 'none';
  if (toPlain) {
    typeTransition([
      { text: 'Initializing build environment...' },
      { text: 'Compiling UI components...' },
      { text: 'Deploying to GUI layer...' },
      { text: 'Warning: UI renderer failed to initialize.', error: true, pause: 2000 },
      { text: 'Attempting fallback...' },
      { text: 'Fallback renderer loaded.' },
      { text: 'Launching graphical interface...' }
    ], () => {
      terminal.style.display = 'none';
      plain.style.display = 'block';
      toggleBtn.textContent = 'Switch to Terminal Mode';
    });
  } else {
    typeTransition([
      { text: 'Shutting down GUI...' },
      { text: 'Restoring shell session...' },
      { text: 'Booting terminal interface...' }
    ], () => {
      plain.style.display = 'none';
      terminal.style.display = 'block';
      toggleBtn.textContent = 'Switch to Plain Mode';
      createPrompt();
    });
  }
});

// -------------------------
// DRAGGABLE WINDOWS LOGIC
// -------------------------
function makeDraggable(el) {
  const titleBar = el.querySelector(".title-bar");
  let offsetX = 0, offsetY = 0, isDragging = false;
  titleBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = ++makeDraggable.z;
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  });
  function move(e) {
    if (!isDragging) return;
    el.style.left = (e.clientX - offsetX) + "px";
    el.style.top = (e.clientY - offsetY) + "px";
  }
  function stop() {
    isDragging = false;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", stop);
  }
}
makeDraggable.z = 100;
document.querySelectorAll(".catboy-card").forEach(makeDraggable);

// -------------------------
// WINDOW MANAGEMENT (OPEN/CLOSE/FOCUS)
// -------------------------
function showWindow(app) {
  document.querySelectorAll('.catboy-card').forEach(win => win.classList.remove('active'));
  const win = document.getElementById('window-' + app);
  if (win) {
    win.classList.add('active');
    win.style.zIndex = ++makeDraggable.z;
    if (app === "terminal") {
      setTimeout(() => document.getElementById("gui-terminal-input").focus(), 100);
    }
  }
  document.querySelectorAll('.taskbar-btn[data-app]').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector('.taskbar-btn[data-app="' + app + '"]');
  if (btn) btn.classList.add('active');
}
function closeWindow(app) {
  const win = document.getElementById('window-' + app);
  if (win) win.classList.remove('active');
  document.querySelectorAll('.taskbar-btn[data-app]').forEach(btn => btn.classList.remove('active'));
}
document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.addEventListener('dblclick', () => {
    showWindow(icon.dataset.app);
  });
  icon.addEventListener('click', () => {
    showWindow(icon.dataset.app);
  });
});
document.querySelectorAll('.taskbar-btn[data-app]').forEach(btn => {
  btn.addEventListener('click', () => {
    showWindow(btn.dataset.app);
  });
});
document.querySelectorAll('.window-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const win = btn.closest('.catboy-card');
    win.classList.remove('active');
    document.querySelectorAll('.taskbar-btn[data-app]').forEach(b => b.classList.remove('active'));
    e.stopPropagation();
  });
});
document.querySelectorAll('.catboy-card').forEach(win => {
  win.addEventListener('mousedown', () => {
    win.style.zIndex = ++makeDraggable.z;
  });
});

// -------------------------
// START MENU LOGIC
// -------------------------
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
startBtn.addEventListener('click', (e) => {
  startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
  startMenu.style.zIndex = ++makeDraggable.z;
  e.stopPropagation();
});
document.addEventListener('click', (e) => {
  if (startMenu.style.display === 'block' && !startMenu.contains(e.target) && e.target !== startBtn) {
    startMenu.style.display = 'none';
  }
});
document.querySelectorAll('.start-menu-item').forEach(item => {
  item.addEventListener('click', () => {
    showWindow(item.dataset.app);
    startMenu.style.display = 'none';
  });
});

// -------------------------
// BOOT ANIMATION
// -------------------------
window.onload = () => {
  const bootArt = [
"⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ",
"⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣷⣤⣀⠀⠀⠀⠈⡉⠒⢲⣤⣀⣀⣤⣴⣶⣶⣿⣿⣿⠀⠀⠀ ",
"⠀⠀⠀⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⠟⠉⠁⠀⠀⡠⠄⠂⠈⢈⡉⠉⠛⢿⣿⣿⣿⣿⣿⡟⠀⠀⠀ ",
"⠀⠀⠀⠀⣠⣾⣿⣿⣿⠀⠀⠀⠀⢸⣿⣿⡿⠟⠁⠀⡠⠀⠀⠀⣠⠔⠀⡠⠚⠀⡄⠀⠀⠉⠻⣿⣿⣿⠁⠀⠀⠀ ",
"⠀⠀⢠⣾⣿⣿⣿⡿⠋⠀⠀⠀⠀⢸⣿⠟⠃⠀⢀⠞⠀⠀⢠⠞⠁⣠⠊⠀⢀⣼⠁⣾⡀⠀⡄⠘⣿⡏⠀⠀⠀⠀ ",
"⠀⢠⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⢀⣶⠏⠂⢠⢀⠎⠀⠀⡰⠃⢀⣼⠃⠀⡠⢋⠇⣰⠁⢿⡄⢸⡆⢹⣇⠀⠀⠀⠀ ",
"⠀⣾⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⣼⡟⠀⠀⡎⣞⠀⣠⡾⢁⣾⢻⠃⣠⡞⠁⡜⡰⠃⠀⢸⡗⢒⡇⠈⣿⠀⠀⠀⠀ ",
"⢰⣿⣿⣿⡏⠀⠀⠀⠀⢀⡠⠞⣿⠁⣄⣰⣼⢁⡝⢳⣷⡟⠁⣼⡴⠙⠀⣼⠟⠁⠀⠀⠸⢸⠀⡇⠀⠿⠀⠀⠀⠀ ",
"⠘⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⣿⢰⣿⡏⢿⡟⢻⡿⢲⣿⡿⣿⣦⣤⣾⣿⣆⣁⣉⣀⡀⣸⢰⠀⠀⣾⠀⠀⠀⠀ ",
"⠀⢿⣿⣿⣿⡄⠀⠀⠀⠀⠀⣰⣿⣿⣿⡇⠘⣰⠈⠃⣾⡟⢡⡘⣿⡏⢸⡏⢩⣭⣽⡟⣿⣿⢻⣿⣼⣏⠀⠀⠀⠀ ",
"⠀⠘⣿⣿⣿⣿⣄⠀⠀⠀⡼⣏⣿⣿⣿⣿⣴⣿⣦⣼⣟⣠⣦⣄⣻⡇⣼⠇⣶⣬⣿⠁⣿⡇⢸⡿⢻⣿⡄⠀⠀⠀ ",
"⠀⠀⠘⢿⣿⣿⣿⣷⣦⡞⢸⣿⡟⢿⣾⡿⣿⢦⡀⠀⠉⠉⠉⠉⠛⠛⠛⠛⠻⠿⠿⢶⣬⣥⣿⣇⣾⠹⡗⠄⠀⠀ ",
"⠀⠀⠀⠀⠙⠻⣿⣿⣿⡅⡿⠀⢧⠘⣇⣷⣝⣆⠉⠒⠀⠀⣀⣀⣀⣀⡀⠀⠀⠀⠀⢸⡿⣁⣼⣿⣿⣠⢸⣆⠀⠀ ",
"⠀⠀⠀⠀⠀⠀⠀⠉⢻⡙⢷⡀⠈⠳⣿⡁⢻⣿⣷⡒⠀⠀⣿⠉⠉⣻⡏⠀⠀⠤⣴⣿⣟⡿⠋⣾⠛⣿⡜⣽⠀⠀ ",
"⠀⠀⠀⠀⠀⠀⠀⡴⠋⠙⠶⣯⣀⡞⣁⡙⢻⣿⣿⣿⣦⣄⡀⠒⠒⠚⢀⣠⣴⣿⣯⣽⣋⣤⡾⠳⣴⣿⠿⢇⠀⠀ ",
"⠀⠀⠀⠀⠀⢠⠃⠀⠀⠀⠀⢀⠭⡉⡿⠋⢹⣌⣿⣏⠻⣿⣷⣶⣿⣿⠋⢙⣿⡀⠀⢙⡏⠀⢠⠞⠙⣗⠢⡉⠀ ",
"⠀⠀⠀⠀⠀⠀⠸⠀⢇⠀⠃⠀⠸⡀⠈⢇⠀⡇⠙⣿⣽⠤⡉⣛⣟⢋⡇⡴⢫⡾⢿⠀⢸⠀⡔⠁⡠⠀⠀⠇⠘⡆ ",
"⠀⠀⠀⠀⠀⠀⢰⡇⠈⠂⢸⠶⡀⠑⣄⠘⡄⠘⣶⠟⠻⣦⣆⣠⣀⣀⣻⣷⠏⠀⢸⠀⠘⠴⢥⣎⣀⠔⣁⡴⠘⡏ ",
"⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠹⠄⠜⠢⣈⡦⠗⠀⠸⢴⡶⡇⠈⠀⠙⠁⠠⢿⣦⠀⠈⠳⠄⣀⠀⠉⠉⠉⠀⣄⡜⠁ ",
" NYANSEC OS v1.0","",
      { text: 'Loading kernel...' },
        { text: 'Detecting devices...' },
        { text: 'Mounting /home/felis...' },
        { text: 'Starting shell...' }
      ];
  const bootLines = bootArt.map(line => typeof line === 'string' ? { text: line, pause: 100 } : line);
  typeTransition(bootLines, () => {
    document.getElementById('terminal').style.display = 'block';
    toggleBtn.style.display = 'inline-block';
    createPrompt();
  }, 250);
};

// -------------------------
// GUI TERMINAL LOGIC
// -------------------------
const guiTerminalOutput = document.getElementById("gui-terminal-output");
const guiTerminalInput = document.getElementById("gui-terminal-input");
let guiHistory = [];
let guiHistoryIndex = -1;

// Print a line to the GUI terminal
function guiPrintLine(text, html = false) {
  const line = document.createElement("div");
  line.className = "output-line";
  if (html) line.innerHTML = text;
  else line.textContent = text;
  guiTerminalOutput.appendChild(line);
  guiTerminalOutput.scrollTop = guiTerminalOutput.scrollHeight;
}

// Handle commands in the GUI terminal window
function guiRunCommand(cmd) {
  if (cmd !== "") guiHistory.push(cmd);
  guiHistoryIndex = guiHistory.length;
  guiPrintLine("$ " + cmd);
  if (cmd === "clear") {
    guiTerminalOutput.innerHTML = "";
    return;
  } else if (cmd === "catfact") {
    const facts = commands.catfact;
    guiPrintLine(facts[Math.floor(Math.random() * facts.length)]);
  } else if (cmd === "joke") {
    const jokes = commands.joke;
    guiPrintLine(jokes[Math.floor(Math.random() * jokes.length)]);
  } else if (cmd.startsWith("echo ")) {
    guiPrintLine(cmd.slice(5));
  } else if (cmd === "neofetch") {
    guiPrintLine(commands.neofetch, true);
  } else if (cmd === "gui") {
    guiPrintLine(commands.gui);
    setTimeout(() => {
      typeTransition([
        { text: 'Initializing build environment...' },
        { text: 'Compiling UI components...' },
        { text: 'Deploying to GUI layer...' },
        { text: 'Warning: UI renderer failed to initialize.', error: true, pause: 2000 },
        { text: 'Attempting fallback...' },
        { text: 'Fallback renderer loaded.' },
        { text: 'Launching graphical interface...' }
      ], () => {
        terminal.style.display = 'none';
        plain.style.display = 'block';
        toggleBtn.textContent = 'Switch to Terminal Mode';
        setTimeout(() => {
          if (terminal.style.display === 'block') createPrompt();
        }, 100);
      });
    }, 500);
    return;
  } else if (cmd === "terminal") {
    guiPrintLine(commands.terminal);
    setTimeout(() => {
      typeTransition([
        { text: 'Shutting down GUI...' },
        { text: 'Restoring shell session...' },
        { text: 'Booting terminal interface...' }
      ], () => {
        plain.style.display = 'none';
        terminal.style.display = 'block';
        toggleBtn.textContent = 'Switch to Plain Mode';
        createPrompt();
      });
    }, 500);
    return;
  } else if (cmd.startsWith("goto ")) {
    // SAFE REDIRECTION
    const page = cmd.slice(5).trim().toLowerCase();
    if (allowedGotoPages[page]) {
      window.location.href = allowedGotoPages[page];
    } else {
      guiPrintLine("Invalid or unsafe redirect. Allowed: Github");
    }
  } else if (cmd === "meow") {
    guiPrintLine(commands.meow);
  } else if (cmd === "pet") {
    guiPrintLine(commands.pet);
  } else if (cmd === "nyan") {
    guiPrintLine(commands.nyan, true);
  } else if (cmd === "help") {
    guiPrintLine(commands.help, true);
  } else if (commands[cmd]) {
    guiPrintLine(commands[cmd], true);
  } else {
    guiPrintLine(`${cmd} is not recognized as a command. Type 'help' for options.`);
  }
}

// GUI terminal input event handling (Enter, Up/Down for history)
guiTerminalInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const cmd = guiTerminalInput.value.trim();
    guiTerminalInput.value = "";
    guiRunCommand(cmd);
  } else if (e.key === "ArrowUp") {
    if (guiHistory.length > 0 && guiHistoryIndex > 0) {
      guiHistoryIndex--;
      guiTerminalInput.value = guiHistory[guiHistoryIndex];
    }
  } else if (e.key === "ArrowDown") {
    if (guiHistory.length > 0 && guiHistoryIndex < guiHistory.length - 1) {
      guiHistoryIndex++;
      guiTerminalInput.value = guiHistory[guiHistoryIndex];
    } else {
      guiTerminalInput.value = "";
    }
  }
});

// Focus GUI terminal input when window is activated
document.getElementById("window-terminal").addEventListener("mousedown", () => {
  setTimeout(() => guiTerminalInput.focus(), 100);
});

// Initialize GUI terminal with welcome message
function initGuiTerminal() {
  guiTerminalOutput.innerHTML = "";
  guiPrintLine("Welcome to R00T-CAT's terminal. Type <b>help</b> to begin.", true);
  guiTerminalInput.value = "";
  guiHistory = [];
  guiHistoryIndex = -1;
}
initGuiTerminal();

// ../../packages/protocol/dist/version.js
var PROVIDER_GLOBAL = "claude";

// ../../packages/protocol/dist/storage.js
var STORAGE_KEY_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
function isValidStorageKey(key) {
  return typeof key === "string" && STORAGE_KEY_RE.test(key);
}

// ../../packages/protocol/dist/errors.js
var BYOPErrorCode = {
  /** User rejected the connect/consent request. (≈ 4001) */
  USER_REJECTED: 4001,
  /** Origin is not connected / has no grant for this method. (≈ 4100) */
  UNAUTHORIZED: 4100,
  /** Method exists but the origin's scope doesn't cover it (model/tool not granted). */
  SCOPE_EXCEEDED: 4110,
  /** A per-action write consent was denied by the user. */
  CONSENT_DENIED: 4120,
  /** Budget or rate limit hit (tokens/day or calls/min). */
  BUDGET_EXCEEDED: 4290,
  /** Unknown method. (≈ 4200) */
  UNSUPPORTED_METHOD: 4200,
  /** Bad params. (≈ -32602) */
  INVALID_PARAMS: -32602,
  /** The sidekick daemon is not installed / not reachable. The SDK maps this to its
   *  "install the sidekick" fallback. */
  PROVIDER_UNAVAILABLE: 4900,
  /** Backend error (model/tool failed for a non-policy reason). */
  BACKEND_ERROR: 4500
};

// ../../packages/sdk/dist/connect-chip.js
function rungFromError(e) {
  if (e?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
    return null;
  return e?.data?.reason === "unpaired" ? { kind: "unpaired" } : { kind: "unreachable" };
}
var CHROME_STORE_URL = "https://chromewebstore.google.com/detail/injmjolmnekmahlnackakiamjepegagb";
var RELAY_DMG_URL = "https://github.com/sameeeeeeep/switchboard/releases/latest/download/Relay.dmg";
var STYLE = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
.chip, .btn { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; border: 0;
  font-size: 13px; font-weight: 600; line-height: 1; border-radius: 10px; }
/* The canonical connect lockup \u2014 the SAME mark + wordmark on every wrapp, so users recognize
   "Connect Switchboard" the way they knew the MetaMask button. Dark pill, lime glyph, locked in
   the shadow root so a host app can't restyle it away. */
.btn { padding: 9px 15px 9px 11px; background: #12151C; color: #E8EDF4; border: 1px solid #2C3444; }
.btn.connect:hover { background: #161B24; border-color: #3A4A18; }
.btn.get { color: #C3CAD6; border-color: #262C38; }
.btn.get:hover { color: #E8EDF4; border-color: #3A4353; }
.btn .arr { color: #6E7C90; font-weight: 500; margin-left: -2px; }
/* The Switchboard mark: lime rounded square with the top-right notch (matches the side-panel brand).
   Muted to slate when the sidekick isn't installed yet \u2014 the mark "lights up" once you can connect. */
.glyph { position: relative; width: 16px; height: 16px; border-radius: 5px; background: #C8F250;
  box-shadow: 0 0 12px rgba(200,242,80,.45); flex: none; }
.glyph::after { content: ""; position: absolute; top: 4px; right: 4px; width: 4px; height: 4px;
  border-radius: 50%; background: #0A0C10; }
.btn.get .glyph { background: #6E7C90; box-shadow: none; }
.wrap { position: relative; display: inline-block; }
.chip { background: #1A1F29; border: 1px solid #262C38; padding: 6px 10px 6px 7px; color: #E8EDF4; }
.chip:hover { border-color: #3A4353; }
.av { width: 26px; height: 26px; border-radius: 7px; background: #C8F250; color: #0A0C10; display: grid;
  place-items: center; font-weight: 700; font-size: 12px; overflow: hidden; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; }
.who { display: flex; flex-direction: column; gap: 3px; min-width: 0; text-align: left; }
.who .hi { font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.who .proj { font-size: 10.5px; font-weight: 500; color: #99A3B7; white-space: nowrap; }
.caret { color: #6E7C90; font-size: 9px; margin-left: 2px; }
.menu { position: absolute; top: calc(100% + 6px); right: 0; z-index: 2147483000; width: 232px;
  background: #1A1F29; border: 1px solid #262C38; border-radius: 12px; padding: 7px;
  box-shadow: 0 18px 40px -20px rgba(0,0,0,.7); }
.menu .lbl { padding: 8px 10px 6px; font-size: 10px; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; color: #6E7C90; }
.menu .proj-row { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px;
  background: #20262F; cursor: pointer; border: 0; width: 100%; color: #E8EDF4; font-size: 13px; font-weight: 600; }
.menu .proj-row:hover { background: #262d38; }
.menu .proj-row .go { margin-left: auto; color: #C8F250; font-size: 11px; font-weight: 600; }
.menu .sep { height: 1px; background: #262C38; margin: 6px 4px; }
.menu .item { display: block; width: 100%; text-align: left; padding: 8px 10px; border: 0; border-radius: 8px;
  background: transparent; color: #B4BECE; font-size: 13px; font-weight: 500; cursor: pointer; }
.menu .item:hover { background: #20262F; color: #E8EDF4; }
.menu .foot { padding: 8px 10px 4px; font-size: 11px; font-weight: 500; color: #6E7C90; line-height: 1.4; }
/* Setup-ladder pills (sidekick asleep / unpaired): quiet and informative, never red \u2014 nothing is
   broken. Amber only while the daemon is unreachable; the glyph stays muted until it's reachable. */
.dot { width: 7px; height: 7px; border-radius: 50%; background: #E8B84B; flex: none;
  box-shadow: 0 0 8px rgba(232,184,75,.45); }
.menu .body { padding: 8px 10px 2px; font-size: 12px; font-weight: 500; color: #B4BECE; line-height: 1.45; }
`;
function mountConnect(target, opts = {}) {
  const installUrl = opts.installUrl ?? "https://thelastprompt.ai/switchboard/";
  const host = document.createElement("div");
  host.style.display = "inline-block";
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = STYLE;
  root.append(style);
  const mount = document.createElement("div");
  root.append(mount);
  target.append(host);
  let state2 = { kind: "booting" };
  let menuOpen = false;
  let destroyed = false;
  let relay2 = null;
  let seq = 0;
  let wasConnected = false;
  let lastProjectKey;
  let sessionDisconnected = false;
  const onDocClick = (e) => {
    if (menuOpen && !host.contains(e.target)) {
      menuOpen = false;
      render2();
    }
  };
  document.addEventListener("click", onDocClick);
  const initEvent = `${PROVIDER_GLOBAL}#initialized`;
  let lateWatching = false;
  const onLateInit = () => {
    lateWatching = false;
    window.removeEventListener(initEvent, onLateInit);
    if (!destroyed)
      void refresh();
  };
  function watchForLateProvider() {
    if (lateWatching || destroyed)
      return;
    lateWatching = true;
    window.addEventListener(initEvent, onLateInit);
  }
  function el3(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text != null)
      n.textContent = text;
    return n;
  }
  async function refresh() {
    const my = ++seq;
    const r = await whenRelayReady(2500, { installUrl });
    if (destroyed || my !== seq)
      return;
    if (!(r instanceof Relay)) {
      watchForLateProvider();
      state2 = { kind: "not-installed", installUrl };
      return render2();
    }
    relay2 = r;
    subscribe(r);
    const h = await r.health();
    if (destroyed || my !== seq)
      return;
    if (h && !h.reachable) {
      state2 = { kind: "unreachable", appMissing: h.installedHere === false };
      emitTransition(false);
      return render2();
    }
    if (h && !h.paired) {
      state2 = { kind: "unpaired" };
      emitTransition(false);
      return render2();
    }
    let permErr = null;
    const grant = sessionDisconnected ? null : await r.permissions().catch((e) => {
      permErr = e;
      return null;
    });
    if (destroyed || my !== seq)
      return;
    if (!grant) {
      const rung = !h ? rungFromError(permErr) : null;
      if (rung) {
        state2 = rung;
        emitTransition(false);
        return render2();
      }
      state2 = { kind: "disconnected", relay: r };
      emitTransition(false);
      return render2();
    }
    const wantsContext = opts.context !== "none";
    const [user, project] = await Promise.all([
      r.identity(),
      wantsContext ? r.context.active().catch(() => null) : Promise.resolve(null)
    ]);
    if (destroyed || my !== seq)
      return;
    const wasAlreadyConnected = wasConnected;
    state2 = { kind: "connected", relay: r, user, project };
    emitTransition(true);
    const projKey = project ? project.id ?? project.name : null;
    if (wasAlreadyConnected && lastProjectKey !== void 0 && projKey !== lastProjectKey)
      opts.onProjectChange?.(project);
    lastProjectKey = projKey;
    render2();
  }
  function emitTransition(connected) {
    if (connected === wasConnected)
      return;
    wasConnected = connected;
    if (connected && relay2)
      opts.onConnect?.(relay2);
    else if (!connected)
      opts.onDisconnect?.();
  }
  let subscribed = false;
  function subscribe(r) {
    if (subscribed)
      return;
    subscribed = true;
    r.on("permissionsChanged", () => {
      void refresh();
    });
    r.on("disconnect", () => {
      void refresh();
    });
    r.on("health", () => {
      void refresh();
    });
  }
  async function doConnect() {
    if (!relay2)
      return;
    try {
      sessionDisconnected = false;
      await relay2.connect(opts.scope);
      await refresh();
    } catch (e) {
      const err = e;
      if (err?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
        return;
      await refresh();
      if (state2.kind === "disconnected") {
        const rung = rungFromError(err);
        if (rung) {
          state2 = rung;
          emitTransition(false);
          render2();
        }
      }
    }
  }
  async function doPick() {
    if (!relay2)
      return;
    menuOpen = false;
    render2();
    await relay2.context.pick().catch(() => null);
    await refresh();
  }
  async function doDisconnect() {
    if (!relay2)
      return;
    menuOpen = false;
    sessionDisconnected = true;
    await relay2.disconnect().catch(() => {
    });
    await refresh();
  }
  function render2() {
    if (destroyed)
      return;
    mount.textContent = "";
    if (state2.kind === "booting")
      return;
    if (state2.kind === "not-installed") {
      const url = state2.installUrl;
      const wrap2 = el3("div", "wrap");
      const b = el3("button", "btn get");
      b.append(el3("span", "glyph"), el3("span", void 0, "Get Switchboard"), el3("span", "arr", "\u2197"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render2();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el3("div", "menu");
        menu.append(el3("div", "body", "Two parts: the Chrome extension, then Relay for Mac."));
        const store = el3("button", "item", "1 \xB7 Add to Chrome \u2197");
        store.onclick = () => {
          menuOpen = false;
          render2();
          window.open(CHROME_STORE_URL, "_blank", "noopener");
        };
        const guide = el3("button", "item", "2 \xB7 Get Relay for Mac \u2197");
        guide.onclick = () => {
          menuOpen = false;
          render2();
          window.open(url, "_blank", "noopener");
        };
        menu.append(store, guide);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "unreachable") {
      const appMissing = state2.appMissing === true;
      const wrap2 = el3("div", "wrap");
      const b = el3("button", "btn get");
      b.append(el3("span", "glyph"), el3("span", void 0, appMissing ? "Get Relay for Mac" : "Your sidekick is asleep"), el3("span", appMissing ? "arr" : "dot", appMissing ? "\u2197" : void 0), ...appMissing ? [] : [el3("span", "caret", "\u25BE")]);
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render2();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el3("div", "menu");
        if (appMissing) {
          menu.append(el3("div", "body", "Extension \u2713 \u2014 now the other half: Relay, the Mac app that holds your Claude."));
          const dl = el3("button", "item", "Download Relay.dmg \u2197");
          dl.onclick = () => {
            menuOpen = false;
            render2();
            window.open(RELAY_DMG_URL, "_blank", "noopener");
          };
          menu.append(dl, el3("div", "sep"));
        } else {
          menu.append(el3("div", "body", "Open the Relay menubar app to wake it."));
          const retry = el3("button", "item", "Retry");
          retry.onclick = () => {
            menuOpen = false;
            render2();
            void refresh();
          };
          menu.append(retry, el3("div", "sep"));
        }
        const setup = el3("button", "item", "New here? Full setup \u2197");
        setup.onclick = () => {
          menuOpen = false;
          render2();
          window.open(installUrl, "_blank", "noopener");
        };
        menu.append(setup);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "unpaired") {
      const wrap2 = el3("div", "wrap");
      const b = el3("button", "btn connect");
      b.append(el3("span", "glyph"), el3("span", void 0, "Almost there \u2014 pair in the side panel"), el3("span", "caret", "\u25BE"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render2();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el3("div", "menu");
        menu.append(el3("div", "body", "Click the Switchboard icon in your Chrome toolbar and paste your pairing token."));
        const retry = el3("button", "item", "Retry");
        retry.onclick = () => {
          menuOpen = false;
          render2();
          void refresh();
        };
        menu.append(retry);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "disconnected") {
      const b = el3("button", "btn connect");
      b.append(el3("span", "glyph"), el3("span", void 0, "Connect Switchboard"));
      b.onclick = doConnect;
      mount.append(b);
      return;
    }
    const { user, project } = state2;
    const rawName = user?.name?.trim();
    const collides = !!rawName && !!project?.name && rawName.toLowerCase() === project.name.toLowerCase();
    const name = !rawName || collides ? "there" : rawName;
    const wrap = el3("div", "wrap");
    const chip = el3("button", "chip");
    const av = el3("div", "av");
    if (user?.avatar) {
      const img = el3("img");
      img.src = user.avatar;
      img.alt = name;
      av.append(img);
    } else
      av.textContent = name.charAt(0).toUpperCase();
    const wantsContext = opts.context !== "none";
    const who = el3("div", "who");
    who.append(el3("div", "hi", `Hi ${name}`));
    who.append(el3("div", "proj", wantsContext ? project ? project.name : "No context lent" : "Connected"));
    chip.append(av, who, el3("span", "caret", "\u25BE"));
    chip.onclick = (e) => {
      e.stopPropagation();
      menuOpen = !menuOpen;
      render2();
    };
    wrap.append(chip);
    if (menuOpen) {
      const menu = el3("div", "menu");
      if (wantsContext) {
        menu.append(el3("div", "lbl", "Working on"));
        const row = el3("button", "proj-row");
        row.append(el3("span", void 0, project ? project.name : "Choose a context"));
        row.append(el3("span", "go", project ? "Switch \u25B8" : "Choose \u25B8"));
        row.onclick = doPick;
        menu.append(row, el3("div", "sep"));
      }
      const dc = el3("button", "item", "Disconnect this app");
      dc.onclick = doDisconnect;
      menu.append(dc);
      menu.append(el3("div", "foot", "Connectors, budgets & activity live in the Switchboard toolbar panel."));
      wrap.append(menu);
    }
    mount.append(wrap);
  }
  render2();
  void refresh();
  return {
    refresh: () => void refresh(),
    destroy: () => {
      destroyed = true;
      document.removeEventListener("click", onDocClick);
      window.removeEventListener(initEvent, onLateInit);
      host.remove();
    }
  };
}

// ../../packages/sdk/dist/index.js
var warnedStorageKeys = /* @__PURE__ */ new Set();
function warnBadStorageKey(key) {
  if (isValidStorageKey(key) || warnedStorageKeys.has(key))
    return;
  warnedStorageKeys.add(key);
  const suggestion = String(key).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[^A-Za-z0-9]+/, "") || "key";
  console.warn(`[relay.storage] invalid key ${JSON.stringify(key)} \u2014 this write/read WILL be rejected by the daemon and silently do nothing.
  Keys map 1:1 to files (<key>.json) in this origin's folder, so they must match ${STORAGE_KEY_RE}.
  ":" is not allowed (illegal on NTFS; "a:b" is Alternate Data Stream syntax on Windows). Try ${JSON.stringify(suggestion)}.`);
}
var Relay = class {
  provider;
  constructor(provider) {
    this.provider = provider;
  }
  get version() {
    return this.provider.version;
  }
  capabilities() {
    return this.provider.request({ method: "claude_capabilities" });
  }
  connect(scope) {
    return this.provider.request({ method: "claude_connect", params: scope });
  }
  /** Drop this app's connection for the current page session. The grant persists (a later connect()
   *  won't reprompt) — this is "disconnect from this tab", not "revoke". Full revoke lives in the panel. */
  disconnect() {
    return this.provider.request({ method: "claude_disconnect" });
  }
  permissions() {
    return this.provider.request({ method: "claude_permissions" });
  }
  /** The setup-ladder snapshot (reachable/paired/connected), answered by the EXTENSION from its
   *  own state — never the daemon — so it resolves fast (<1s) in every degraded state, including
   *  the ones where every other method would hang. Resolves null when the extension is too old to
   *  know `claude_health` (or its worker is unreachable): callers MUST treat null as "unknown"
   *  and fall back to probing permissions() exactly as before — that skew guard is load-bearing
   *  while store users run an older extension against newer app bundles. */
  health() {
    const answer = this.provider.request({ method: "claude_health" }).catch(() => null);
    const timer = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
    return Promise.race([answer, timer]);
  }
  /** The paired user's public identity (name/avatar), or null if unavailable. Convenience over
   *  capabilities().user — what the connect chip greets with ("Hi Sameep"). */
  identity() {
    return this.capabilities().then((c) => c.user ?? null).catch(() => null);
  }
  /** Synthesize speech ON-DEVICE via a local model/engine (no cloud, no connector, no credits).
   *  Returns audio as a playable data: URL, or null if no local TTS is available.
   *
   *    const clip = await relay.speak("hey, it's Maya");
   *    if (clip) new Audio(clip.audio).play();
   */
  speak(text, opts) {
    return this.provider.request({ method: "claude_speak", params: { text, voice: opts?.voice } }).catch(() => null);
  }
  listTools() {
    return this.provider.request({ method: "claude_listTools" }).then((r) => r.tools);
  }
  callTool(name, args) {
    const call = { name, arguments: args };
    return this.provider.request({ method: "claude_callTool", params: call });
  }
  complete(params) {
    return this.provider.request({ method: "claude_complete", params });
  }
  /** Streamed completion as an async iterator of deltas. Ends after a `done`/`error` delta. */
  async *stream(params) {
    const { streamId } = await this.provider.request({ method: "claude_stream", params });
    const queue = [];
    let notify = null;
    let ended = false;
    const handler = (payload) => {
      const p = payload;
      if (p.streamId !== streamId)
        return;
      queue.push(p);
      if (p.type === "done" || p.type === "error")
        ended = true;
      notify?.();
    };
    this.provider.on("delta", handler);
    try {
      while (true) {
        if (queue.length === 0) {
          if (ended)
            break;
          await new Promise((r) => notify = r);
          notify = null;
          continue;
        }
        yield queue.shift();
      }
    } finally {
      this.provider.removeListener("delta", handler);
    }
  }
  on(event, handler) {
    this.provider.on(event, handler);
  }
  /**
   * Per-origin local storage — a private on-disk key/value store for this app, plus `bind` to point
   * it at a real folder the user picks. Values are opaque strings (store JSON). Isolated per origin;
   * reads are free, writes need the site not to be read-only, and `bind` prompts for the exact path.
   *
   *   await relay.storage.set("workspace", JSON.stringify(data));
   *   const raw = await relay.storage.get("workspace");
   *   await relay.storage.bind("~/Documents/Projects/brandbrain/.data"); // existing files appear as records
   */
  get storage() {
    const req = (params) => this.provider.request({ method: "claude_storage", params });
    const k = (key) => {
      warnBadStorageKey(key);
      return key;
    };
    return {
      get: (key) => req({ op: "get", key: k(key) }).then((r) => r.value ?? null),
      set: (key, value) => req({ op: "set", key: k(key), value }).then(() => void 0),
      delete: (key) => req({ op: "delete", key: k(key) }).then((r) => r.ok),
      list: () => req({ op: "list" }).then((r) => r.keys ?? []),
      info: () => req({ op: "info" }).then((r) => r.info),
      /** Point this app's store at a real folder (triggers a path-consent click). */
      bind: (path) => req({ op: "bind", path }).then((r) => r.info),
      /** Open a NATIVE folder chooser on the daemon's machine (macOS today). The user picking a
       *  folder in an OS dialog that names this origin IS the path consent, so a successful pick
       *  comes back already bound. Resolves undefined on cancel or when no native picker exists —
       *  keep a typed-path `bind` as the fallback UI. */
      pick: (reason) => req({ op: "pick", reason }).then((r) => r.info).catch(() => void 0)
    };
  }
  /**
   * Shared, cross-app context — your portable brand knowledge. Publish a whole context; read the one
   * the user selected for this app; or open the picker. Selection happens in the side panel, so an
   * app only ever receives the context the user chose to lend it — never the whole library.
   *
   *   await relay.context.publish({ name: "Aamras", kind: "brand", data: brand });
   *   const active = await relay.context.active();   // the brand the user loaded for this app, or null
   */
  get context() {
    const req = (params) => this.provider.request({ method: "claude_context", params });
    return {
      publish: (context) => req({ op: "publish", context }).then((r) => r.id),
      list: () => req({ op: "list" }).then((r) => r.contexts ?? []),
      active: () => req({ op: "active" }).then((r) => r.context ?? null),
      pick: () => req({ op: "pick" }).then((r) => r.context ?? null),
      /** Read ONE context listed via `list()` in full, and make it this app's selection. Needs the
       *  kind granted at connect (ScopeRequest.contextKinds) — powers in-app brand dropdowns. */
      use: (id) => req({ op: "use", id }).then((r) => r.context ?? null)
    };
  }
};
var DEFAULT_INSTALL_URL = "https://thelastprompt.ai/switchboard/";
function getRelay(opts) {
  const provider = globalThis[PROVIDER_GLOBAL];
  if (provider?.isRelay)
    return new Relay(provider);
  return { installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL };
}
function whenRelayReady(timeoutMs = 3e3, opts) {
  const now = getRelay(opts);
  if (now instanceof Relay)
    return Promise.resolve(now);
  return new Promise((resolve) => {
    const onInit = () => {
      cleanup();
      resolve(getRelay(opts));
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve({ installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL });
    }, timeoutMs);
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
    }
    window.addEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
  });
}

// src/kit/speaker.js
function mountSpeaker(relay2, opts = {}) {
  let audio = null;
  let available = null;
  const voice = opts.voice;
  function stop() {
    if (audio) {
      try {
        audio.pause();
      } catch {
      }
      audio = null;
    }
  }
  async function speak(text) {
    text = String(text || "").trim();
    if (!text || !relay2 || available === false) return false;
    let clip = null;
    try {
      clip = await relay2.speak(text, voice ? { voice } : void 0);
    } catch {
      clip = null;
    }
    if (!clip || !clip.audio) {
      available = false;
      return false;
    }
    available = true;
    stop();
    return await new Promise((resolve) => {
      audio = new Audio(clip.audio);
      audio.onended = () => resolve(true);
      audio.onerror = () => resolve(false);
      audio.play().catch(() => resolve(false));
    });
  }
  return {
    speak,
    stop,
    /** true/false/null(unknown-until-first-speak) — lets a wrapp hide a voice toggle when absent. */
    get available() {
      return available;
    },
    destroy() {
      stop();
    }
  };
}

// src/kit/ui.js
var el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
var str = (s) => String(s ?? "").trim();
var STYLE_ID = "relay-kit-ui";
var ACCENT = "var(--accent, var(--lime, #C8F250))";
var ACCENT_SOFT = "var(--accent-soft, var(--lime-soft, #232B0D))";
var CSS = `
/* zero-specificity base: only applies where the shell styles nothing */
:where(.opts) { display: flex; flex-direction: column; gap: 8px; }
:where(.opt) { position: relative; border: 1px solid var(--edge, #262C38); background: var(--inset, #070809); border-radius: 14px; padding: 13px 14px; cursor: pointer; transition: border-color .15s, background .15s; }
:where(.opt:hover) { border-color: var(--edge-soft, #1C212B); }
:where(.opt.sel) { border-color: ${ACCENT}; background: color-mix(in srgb, ${ACCENT_SOFT} 55%, var(--inset, #070809)); }
:where(.opt .check) { position: absolute; right: 11px; top: 11px; width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--edge, #262C38); display: grid; place-items: center; color: transparent; font: 700 11px/1 var(--sans, sans-serif); }
:where(.opt.sel .check) { border-color: ${ACCENT}; background: ${ACCENT}; color: var(--page, #0A0C10); }
:where(.opt .rec) { display: inline-block; font: 500 9px/1 var(--mono, monospace); letter-spacing: .1em; text-transform: uppercase; border-radius: 999px; padding: 3px 7px; margin-bottom: 7px; }
:where(.opt .o-label) { font: 600 13.5px/1.3 var(--display, sans-serif); color: var(--ink, #E8EDF4); padding-right: 22px; }
:where(.opt .o-text) { font: 400 13px/1.5 var(--sans, sans-serif); color: var(--ink-sec, #B4BECE); margin-top: 5px; white-space: pre-wrap; word-break: break-word; }
:where(.opt .o-img) { width: 100%; border-radius: 8px; border: 1px solid var(--edge, #262C38); display: block; margin-top: 8px; }
:where(.steer) { margin-top: 16px; display: flex; flex-direction: column; gap: 7px; }
:where(.steer .chips) { display: flex; flex-wrap: wrap; gap: 6px; }
:where(.steer .chip) { font: 500 11px/1 var(--sans, sans-serif); border: 1px solid var(--edge, #262C38); background: var(--panel, #12151C); color: var(--ink-sec, #B4BECE); border-radius: 999px; padding: 6px 10px; cursor: pointer; }
:where(.steer .row) { display: flex; gap: 8px; align-items: center; }
:where(.steer .box) { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; border: 1px solid var(--edge, #262C38); background: var(--panel, #12151C); border-radius: 10px; padding: 8px 11px; }
:where(.steer input) { flex: 1; min-width: 0; background: none; border: 0; outline: none; color: var(--ink, #E8EDF4); font: 400 12.5px/1.4 var(--sans, sans-serif); }
:where(.steer .send) { flex: none; font: 600 12px/1 var(--sans, sans-serif); background: ${ACCENT}; color: var(--page, #0A0C10); border: 0; border-radius: 9px; padding: 9px 12px; cursor: pointer; }

/* ---- kit modifiers: normal specificity, these MUST beat the shell ---- */
/* DRAFTED \u2014 a machine suggestion. Neutral ink on a hairline, never the brand accent (rule 5). */
.opt .rec.k-draft { color: var(--ink-dim, #99A3B7); background: transparent; border: 1px dashed var(--edge, #262C38); }
.opt.k-drafted { border-style: dashed; }
.opt.k-drafted:not(.sel) { background: var(--inset, #070809); }
/* CHOSEN \u2014 a human clicked. The shell's own .opt.sel accent rules do the painting; this only adds
   the receipt line, so "who decided this" is never a guess (rule 6). */
.opt .k-by { display: block; font: 500 9px/1 var(--mono, monospace); letter-spacing: .1em; text-transform: uppercase; color: var(--ink-faint, #6E7C90); margin-top: 8px; }
.opt.sel .k-by { color: ${ACCENT}; }
/* ESCAPE HATCH \u2014 the human's own answer. Reads as an option, never as one of the generated ones. */
.opt.k-esc { border-style: dashed; cursor: pointer; }
.opt.k-esc .o-label { color: var(--ink-sec, #B4BECE); }
.opt.k-esc .k-escrow { display: flex; gap: 8px; align-items: center; margin-top: 9px; }
.opt.k-esc .k-escrow input { flex: 1; min-width: 0; background: var(--inset, #070809); border: 1px solid var(--edge, #262C38); border-radius: 9px; color: var(--ink, #E8EDF4); font: 400 12.5px/1.4 var(--sans, sans-serif); padding: 9px 11px; outline: none; }
.opt.k-esc .k-escrow input:focus { border-color: color-mix(in srgb, ${ACCENT} 55%, var(--edge, #262C38)); }
.opt.k-esc .k-escrow .send { flex: none; font: 600 12px/1 var(--sans, sans-serif); background: ${ACCENT}; color: var(--page, #0A0C10); border: 0; border-radius: 9px; padding: 9px 12px; cursor: pointer; }
.opt.k-esc .k-escrow .send:disabled { opacity: .5; cursor: default; }
.opt.k-esc .k-escrow .ghost { flex: none; font: 500 12px/1 var(--sans, sans-serif); background: none; border: 1px solid var(--edge, #262C38); color: var(--ink-dim, #99A3B7); border-radius: 9px; padding: 9px 12px; cursor: pointer; }
`;
function ensureStyle() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = CSS;
  (document.head || document.documentElement).append(s);
}
var idOf = (o) => o && typeof o === "object" ? o.id : o;
function draftIdOf(x) {
  if (Array.isArray(x)) {
    const r = x.find((o) => o && o.recommended);
    return idOf(r || x[0]);
  }
  return idOf(x);
}
function optionCards(a, b, c, d) {
  ensureStyle();
  const o = Array.isArray(a) ? { options: a, chosenId: b, onChoose: c, ...d || {} } : a || {};
  const options = o.options || [];
  const sel = o.sel || null;
  const chosenId = o.chosenId !== void 0 ? o.chosenId : sel ? sel.chosenId : null;
  const draftedId = o.draftedId !== void 0 ? o.draftedId : sel && sel.draftedId !== void 0 ? sel.draftedId : draftIdOf(options);
  const onChoose = o.onChoose || o.onPick || (() => {
  });
  const recLabel = o.recommendedLabel || "recommended";
  const chosenNote = o.chosenNote === void 0 ? "chosen by you" : o.chosenNote;
  const wrap = el("div", "opts");
  wrap.setAttribute("role", "radiogroup");
  for (const opt of options) {
    const locked = chosenId != null && opt.id === chosenId;
    const drafted = !locked && draftedId != null && opt.id === draftedId;
    const card = el("div", "opt" + (locked ? " sel" : "") + (drafted ? " k-drafted" : ""));
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", locked ? "true" : "false");
    card.tabIndex = o.disabled ? -1 : 0;
    const pick = () => {
      if (!o.disabled) onChoose(opt);
    };
    card.onclick = pick;
    card.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick();
      }
    };
    if (o.disabled) card.style.opacity = ".55";
    card.append(el("div", "check", "\u2713"));
    if (drafted || locked && draftedId === opt.id) card.append(el("div", "rec k-draft", recLabel));
    else if (opt.recommended && draftedId == null) card.append(el("div", "rec k-draft", recLabel));
    card.append(el("div", "o-label", opt.label));
    if (opt.text) card.append(el("div", "o-text", opt.text));
    if (opt.imageUrl) {
      const img = el("img", "o-img");
      img.src = opt.imageUrl;
      img.alt = opt.label || "";
      card.append(img);
    }
    if (typeof o.decorate === "function") o.decorate(card, opt);
    if (locked && chosenNote) card.append(el("span", "k-by", chosenNote));
    wrap.append(card);
  }
  if (o.escape) wrap.append(escapeHatch(o.escape));
  return wrap;
}
function escapeHatch(opts) {
  ensureStyle();
  const o = opts || {};
  const label = o.label || "none of these \u2014 say what you'd do instead";
  const card = el("div", "opt k-esc");
  card.append(el("div", "o-label", label));
  if (o.hint) card.append(el("div", "o-text", o.hint));
  const row = el("div", "k-escrow");
  row.hidden = true;
  const input = el("input");
  input.type = "text";
  input.placeholder = o.placeholder || "describe what you'd do instead\u2026";
  if (o.prefill) input.value = o.prefill;
  const send = el("button", "send", o.sendLabel || "use this");
  send.type = "button";
  const cancel = el("button", "ghost", "cancel");
  cancel.type = "button";
  row.append(input, send, cancel);
  card.append(row);
  const open = () => {
    if (!row.hidden) return;
    row.hidden = false;
    input.focus();
    input.select();
  };
  const close = () => {
    row.hidden = true;
  };
  card.onclick = (e) => {
    if (e.target.closest(".k-escrow")) return;
    open();
  };
  card.onkeydown = (e) => {
    if (e.target === card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open();
    }
  };
  card.tabIndex = 0;
  let busy = false;
  const submit = () => {
    const text = str(input.value);
    if (!text || busy) return;
    const option = { id: "custom", label: text, text: "", custom: true };
    const out = typeof o.onSubmit === "function" ? o.onSubmit(text, option) : null;
    if (out && typeof out.then === "function") {
      busy = true;
      const was = send.textContent;
      send.disabled = true;
      send.textContent = "\u2026";
      out.finally(() => {
        busy = false;
        send.disabled = false;
        send.textContent = was;
        close();
      });
    } else {
      close();
    }
  };
  send.onclick = submit;
  cancel.onclick = close;
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };
  card.open = open;
  card.close = close;
  card.value = () => str(input.value);
  return card;
}

// src/huddle.js
var APP = {
  id: "huddle",
  name: "Huddle",
  installUrl: "https://thelastprompt.ai/switchboard/",
  scope: {
    reason: "Huddle \u2014 a working call with Claude on your own model; Claude speaks back on-device and can read the project you lend it",
    models: ["sonnet"],
    tools: ["WebSearch", "WebFetch"],
    // The call is grounded in the LENT context first (that's what makes the openers real) and in an
    // optional bound folder second. Reused grants are exact-match and ignore newly requested kinds,
    // so every list()/use() call below tolerates an empty result or a throw.
    contextKinds: ["project", "brand", "note", "personal"]
  },
  usesContext: "single"
  // a lent context grounds the call; a bound folder deepens it
};
var $ = (id) => document.getElementById(id);
var el2 = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
var uid = () => Math.random().toString(36).slice(2, 9);
var msg = (e) => String(e?.message || e).slice(0, 160);
var toastT = null;
function toast(text, err) {
  clearTimeout(toastT);
  let t = document.querySelector(".toast");
  if (!t) {
    t = el2("div", "toast");
    document.body.append(t);
  }
  t.className = "toast" + (err ? " err" : "");
  t.textContent = text;
  toastT = setTimeout(() => t.remove(), 3200);
}
var relay = null;
var notInstalled = false;
var brand = null;
var wired = false;
mountConnect($("chip-dock"), {
  scope: APP.scope,
  context: APP.usesContext,
  installUrl: APP.installUrl,
  onConnect: (r) => {
    relay = r;
    wire(r);
    void onReady();
  },
  onDisconnect: () => {
    relay = null;
    render();
  },
  onProjectChange: () => {
    void syncContext();
  }
});
(async () => {
  const r = await whenRelayReady(2e3, { installUrl: APP.installUrl });
  if (r && "connect" in r) {
    const grant = await r.permissions().catch(() => null);
    if (grant) {
      relay = r;
      wire(r);
      void onReady();
      return;
    }
  } else if (r && r.installed === false) notInstalled = true;
  render();
})();
function wire(r) {
  if (wired) return;
  wired = true;
  r.on("permissionsChanged", () => void syncContext());
}
var hydrated = false;
async function onReady() {
  await syncContext();
  if (!hydrated) {
    hydrated = true;
    await loadState();
  }
  render();
  autostart();
}
async function syncContext() {
  if (!relay) return;
  if (APP.usesContext === "single") {
    brand = await relay.context.active().catch(() => null);
    if (!brand && typeof relay.context.list === "function" && typeof relay.context.use === "function") {
      try {
        const metas = await relay.context.list() || [];
        const rank = { project: 0, brand: 1, note: 2, personal: 3 };
        const best = metas.slice().sort((a, b) => (rank[(a.kind || "").toLowerCase()] ?? 9) - (rank[(b.kind || "").toLowerCase()] ?? 9))[0];
        if (best) brand = await relay.context.use(best.id) || null;
      } catch {
      }
    }
  }
  render();
}
var state = { run: null };
async function loadState() {
  try {
    const raw = await relay.storage.get(APP.id + "-state");
    if (raw) state = JSON.parse(raw);
  } catch {
    state = { run: null };
  }
}
var STREAM_TIMEOUT_MS = 18e4;
async function streamText(params, onProgress) {
  const it = relay.stream(params);
  let text = "", settled = false, timer = null;
  try {
    return await Promise.race([
      (async () => {
        for await (const d of it) {
          if (d.type === "text") {
            text += d.text;
            onProgress && onProgress({ text });
          } else if (d.type === "tool_proposed") {
            onProgress && onProgress({ tool: d.call?.name });
          } else if (d.type === "error") throw new Error(d.error?.message || "stream error");
        }
        settled = true;
        return text;
      })(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          if (settled) return;
          try {
            it.return?.();
          } catch {
          }
          reject(new Error("Switchboard didn't respond \u2014 is the sidekick running? Reload this tab and try again."));
        }, STREAM_TIMEOUT_MS);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}
async function askJsonArray(parts) {
  return parseJsonArray(await streamText({ prompt: parts.filter(Boolean).join("\n\n") }));
}
function parseJsonArray(text) {
  const t = String(text || "").replace(/```[a-z]*\n?/gi, "").trim();
  const s = t.indexOf("["), e = t.lastIndexOf("]");
  if (s === -1 || e <= s) return null;
  try {
    const a = JSON.parse(t.slice(s, e + 1));
    return Array.isArray(a) ? a : null;
  } catch {
    return null;
  }
}
function researching(status) {
  const r = el2("div", "researching");
  r.append(el2("div", "scan"), el2("span", null, status || "working\u2026"));
  return r;
}
function connectSteps() {
  const card = el2("div", "steps-card");
  const steps = el2("div", "steps");
  const s1 = el2("div");
  s1.innerHTML = notInstalled ? "<b>1</b> \xB7 Install Switchboard (button, top-right)" : "<b>1</b> \xB7 Connect Switchboard (top-right) \u2014 lends this page your Claude";
  const s2 = el2("div");
  s2.innerHTML = "<b>2</b> \xB7 Four openers from your project \u2014 nothing to type";
  const s3 = el2("div");
  s3.innerHTML = "<b>3</b> \xB7 The \u2605 one is already answered; take it from there";
  steps.append(s1, s2, s3);
  card.append(steps);
  return card;
}
var running = false;
var startersLoading = false;
var startersTried = false;
var speaker = null;
var camStream = null;
var SESSION_ID = "huddle-" + uid();
var session = { folder: null, files: [], turns: [], starters: null, starterError: null, chosenStarterId: null, camOn: false, voiceOn: true, status: "", error: null };
var opened = false;
function autostart() {
  void openCall();
}
async function openCall() {
  if (opened) return;
  opened = true;
  await loadCall();
  if (session.turns.length) {
    startersTried = true;
    return;
  }
  if (startersTried) return;
  startersTried = true;
  await loadStarters();
}
async function loadCall() {
  try {
    const raw = await relay.storage.get(APP.id + "-call");
    if (raw) {
      const s = JSON.parse(raw);
      session.turns = s.turns || [];
      session.folder = s.folder || null;
    }
  } catch {
  }
  if (session.folder) await refreshFiles();
  render();
}
async function saveCall() {
  try {
    await relay.storage.set(APP.id + "-call", JSON.stringify({ turns: session.turns.slice(-40), folder: session.folder }));
  } catch {
  }
}
async function bindProject(path) {
  if (!relay) return;
  session.status = "opening the project\u2026";
  render();
  try {
    const info = await relay.storage.bind(String(path).trim());
    if (!info) throw new Error("bind declined");
    session.folder = info.folder;
    await refreshFiles();
  } catch (e) {
    toast("Couldn't open \u2014 " + msg(e), true);
  } finally {
    session.status = "";
    await saveCall();
    render();
  }
}
async function refreshFiles() {
  try {
    const keys = await relay.storage.list();
    session.files = (keys || []).filter((k) => /\.(md|txt|json|js|ts|tsx|css|html)$/i.test(k)).slice(0, 40);
  } catch {
    session.files = [];
  }
}
async function projectGrounding() {
  if (!session.folder || !session.files.length) return "";
  const heads = [];
  for (const k of session.files.slice(0, 6)) {
    try {
      const v = await relay.storage.get(k);
      if (v) heads.push(`--- ${k} ---
${String(v).slice(0, 800)}`);
    } catch {
    }
  }
  return `PROJECT FOLDER: ${session.folder}
FILES: ${session.files.join(", ")}

${heads.join("\n\n")}`.slice(0, 6e3);
}
var ctxBlob = (n) => brand ? JSON.stringify(brand.data || {}).slice(0, n || 2200) : "";
async function loadStarters(steer) {
  if (!relay || startersLoading) return;
  startersLoading = true;
  session.starterError = null;
  render();
  try {
    const arr = await askJsonArray([
      `You are setting the agenda for a founder's working session on "${brand ? brand.name : "their project"}".`,
      brand ? `THE PROJECT \u2014 every question must come from here (its products, status, roadmap, open tasks, audience): ${ctxBlob()}` : "Nothing was lent, so keep the openers concrete and useful to any small product team shipping this week.",
      session.folder && session.files.length ? `They also opened the folder ${session.folder} \u2014 files: ${session.files.slice(0, 20).join(", ")}` : "",
      "Propose 4 opening questions the founder would genuinely want answered in the first ten minutes. Each must name something specific from the material above \u2014 a real product, a real decision, a real gap. No generic coaching questions, no 'what are your goals'.",
      steer ? `Steer (apply it): "${steer}"` : "",
      `Return ONLY a JSON array \u2014 no prose, no fences. Each element: {"label":<the question, asked in the founder's own first person, at most 14 words>,"text":<one line on why it is worth the first ten minutes>,"recommended":<true for exactly one>}`
    ]);
    if (!arr || !arr.length) throw new Error("no openers came back \u2014 hit \u27F3 other openers");
    const opts = arr.slice(0, 4).map((o) => ({
      id: uid(),
      label: String(o.label || o.title || o.question || "Where should I start?").slice(0, 120),
      text: String(o.text || o.body || o.description || "").trim().slice(0, 240),
      recommended: !!o.recommended
    }));
    if (!opts.some((o) => o.recommended)) opts[0].recommended = true;
    let seen = false;
    for (const o of opts) {
      if (o.recommended) {
        if (seen) o.recommended = false;
        else seen = true;
      }
    }
    session.starters = opts;
    session.chosenStarterId = null;
  } catch (e) {
    session.starterError = msg(e);
  } finally {
    startersLoading = false;
    render();
    const rec = (session.starters || []).find((o) => o.recommended);
    if (rec && !session.turns.length && !running) void ask(rec.label);
  }
}
async function toggleCam() {
  session.camOn = !session.camOn;
  if (session.camOn) {
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 } }, audio: false });
    } catch {
      session.camOn = false;
      toast("Camera declined.", true);
    }
  } else if (camStream) {
    for (const t of camStream.getTracks()) t.stop();
    camStream = null;
  }
  render();
}
async function ask(text) {
  text = String(text || "").trim();
  if (!text || !relay || running) return;
  session.turns.push({ role: "user", text });
  session.turns.push({ role: "assistant", text: "", pending: true });
  running = true;
  session.error = null;
  render();
  const turn = session.turns[session.turns.length - 1];
  try {
    const grounding = await projectGrounding();
    const full = await streamText({
      sessionId: SESSION_ID,
      system: "You are on a live working call with the founder, helping move their project forward. Be concise and spoken \u2014 short paragraphs, one idea at a time, like talk not an essay. Ask a sharp question when it would help." + (brand ? `

The project they lent you is "${brand.name}":
` + ctxBlob(2500) : "") + (grounding ? "\n\nYou can also see their files:\n" + grounding : ""),
      prompt: text,
      maxTokens: 1200
    }, (p) => {
      if (p.text) {
        turn.text = p.text;
        const live = document.querySelector(".turn.pending .bubble");
        if (live) live.textContent = p.text;
      }
    });
    turn.text = full.trim();
    turn.pending = false;
    if (session.voiceOn && speaker) void speaker.speak(turn.text);
  } catch (e) {
    turn.pending = false;
    turn.text = "";
    session.error = msg(e);
    session.turns.pop();
  } finally {
    running = false;
    await saveCall();
    render();
  }
}
function render() {
  const hero = $("hero"), view = $("view");
  hero.hidden = !!relay;
  view.textContent = "";
  if (!relay) {
    view.append(connectSteps());
    return;
  }
  if (!speaker) speaker = mountSpeaker(relay);
  const stage = el2("div", "call-stage");
  const cam = el2("div", "cam" + (session.camOn ? " on" : ""));
  if (session.camOn && camStream) {
    const v = el2("video");
    v.autoplay = true;
    v.muted = true;
    v.playsInline = true;
    v.srcObject = camStream;
    v.style.transform = "scaleX(-1)";
    cam.append(v);
  } else cam.append(el2("div", "cam-off", "camera off"));
  stage.append(cam);
  const claude = el2("div", "cam claude");
  claude.append(el2("div", "orb" + (running ? " live" : "")), el2("div", "cam-tag", running ? "Claude is talking\u2026" : "Claude"));
  stage.append(claude);
  view.append(stage);
  const ctl = el2("div", "call-ctl");
  const camBtn = el2("button", "act" + (session.camOn ? " on" : ""));
  camBtn.textContent = session.camOn ? "\u25C9 camera on" : "\u25CB camera";
  camBtn.onclick = () => void toggleCam();
  const vBtn = el2("button", "act" + (session.voiceOn ? " on" : ""));
  vBtn.textContent = session.voiceOn ? "\u{1F50A} voice on" : "\u{1F507} voice off";
  vBtn.onclick = () => {
    session.voiceOn = !session.voiceOn;
    if (!session.voiceOn && speaker) speaker.stop();
    render();
  };
  ctl.append(camBtn, vBtn);
  if (session.folder) {
    const f = el2("span", "proj-tag");
    f.textContent = "\u25B8 " + session.folder + " (" + session.files.length + " files)";
    ctl.append(f);
    const chg = el2("button", "act", "change");
    chg.onclick = () => {
      session.folder = null;
      render();
    };
    ctl.append(chg);
  } else {
    const b2 = el2("button", "act", "\uFF0B bring a project folder");
    b2.onclick = () => {
      const p = prompt("Project folder to work on (path):", "~/Documents/Projects/");
      if (p) void bindProject(p);
    };
    ctl.append(b2);
  }
  view.append(ctl);
  if (session.status) view.append(researching(session.status));
  if (session.error) view.append(el2("div", "err", session.error));
  const shead = el2("div", "opener-head");
  shead.append(el2("span", "kicker", "on the table"));
  shead.append(el2("span", "opener-src", brand ? "drawn from " + brand.name : "no context lent \u2014 general openers"));
  const more = el2("button", "act", "\u27F3 other openers");
  more.disabled = startersLoading || running;
  more.onclick = () => void loadStarters();
  shead.append(more);
  view.append(shead);
  if (startersLoading) view.append(researching("reading " + (brand ? brand.name : "the project") + " for what's worth asking\u2026"));
  if (session.starterError) {
    view.append(el2("div", "err", session.starterError));
    const t = el2("button", "act", "try again");
    t.onclick = () => void loadStarters();
    view.append(t);
  }
  if (session.starters && session.starters.length) {
    view.append(optionCards({
      options: session.starters,
      chosenId: session.chosenStarterId,
      // null until a human clicks — the ★ never lands here
      chosenNote: "you opened on this",
      disabled: running,
      onChoose: (o) => {
        if (running) return;
        session.chosenStarterId = o.id;
        void ask(o.label);
      },
      // The way out of the menu: the founder's own opener beats four drafted ones. (doctrine 4)
      escape: {
        label: "none of these \u2014 say what you'd rather open on",
        hint: "asked as-is, on the same call",
        placeholder: "e.g. I need to decide whether to cut the free tier this week\u2026",
        sendLabel: "open on this",
        onSubmit: (text) => {
          if (running) return;
          session.chosenStarterId = null;
          void ask(text);
        }
      }
    }));
  }
  const log = el2("div", "call-log");
  if (!session.turns.length && !startersLoading) log.append(el2("div", "empty", "Pick one above \u2014 or type anything. Claude answers in text and talks back."));
  for (const t of session.turns) {
    const row = el2("div", "turn " + t.role + (t.pending ? " pending" : ""));
    const b2 = el2("div", "bubble");
    b2.textContent = t.pending ? "\u2026" : t.text;
    row.append(b2);
    log.append(row);
  }
  view.append(log);
  const comp = el2("div", "composer");
  const input = el2("input");
  input.placeholder = running ? "Claude is answering\u2026" : "type to the call \u2014 \u23CE to send";
  input.disabled = running;
  const send = () => {
    const t = input.value.trim();
    if (t && !running) {
      input.value = "";
      void ask(t);
    }
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
  const b = el2("button", "primary", "Send");
  b.disabled = running;
  b.onclick = send;
  comp.append(input, b);
  view.append(comp);
  if (!running) setTimeout(() => input.focus(), 30);
}
render();
//# sourceMappingURL=huddle.js.map

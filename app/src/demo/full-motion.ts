// The demo always plays in full, even when the OS asks for reduced motion (a deliberate design choice).
// The kit reads that preference through matchMedia, so while the demo is on screen (html[data-motion='full'])
// that one query answers "no". The clickable app keeps following the OS setting.
const REDUCE = /prefers-reduced-motion:\s*reduce/
const native = window.matchMedia.bind(window)

window.matchMedia = (query: string) => {
  if (!REDUCE.test(query) || document.documentElement.dataset.motion !== 'full') return native(query)
  const noop = () => {}
  return {
    matches: false, media: query, onchange: null,
    addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop,
    dispatchEvent: () => false,
  } as MediaQueryList
}

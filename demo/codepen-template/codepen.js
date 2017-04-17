const plugin = require('postcss-easing-gradients')
const styles = document.head.getElementsByTagName('style')

const updateStyle = (style) => {
  plugin.process(style.textContent).then(
    (result) => {
      style.textContent = result.css
    },
    console.error
  )
}

if (styles.length) {
  Array.prototype.forEach.call(styles, updateStyle)
}

(new MutationObserver(
  (mutations) => mutations.forEach(
    (mutation) => Array.prototype.filter.call(
      mutation.addedNodes || [],
      (node) => node.nodeName === 'STYLE'
    ).forEach(updateStyle)
  )
)).observe(
  document.head,
  {
    childList: true
  }
)

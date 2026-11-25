import { useLayoutEffect, useRef, useState } from 'react'

export const useTruncated = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [truncated, setTruncated] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      const value =
        el.scrollWidth - el.clientWidth > 1 ||
        el.scrollHeight - el.clientHeight > 1
      setTruncated(value)
    }

    check()
    document.fonts.ready.then(check)

    const resizeObserver = new ResizeObserver(check)
    resizeObserver.observe(el)

    // 文字内容变化时元素盒子尺寸可能不变，ResizeObserver 不会触发，需要单独监听
    const mutationObserver = new MutationObserver(check)
    mutationObserver.observe(el, {
      characterData: true,
      childList: true,
      subtree: true
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return { ref, truncated }
}

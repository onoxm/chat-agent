import { useEffect, useRef, useState, type PointerEvent } from 'react'

type CloseFit = 'left' | 'right' | 'top' | 'bottom'

interface ResizeDividerProps {
  /** 被调整尺寸的面板相对分隔条的位置 */
  closeFit?: CloseFit
  /** 拖动方向：horizontal 沿 X 轴调整宽度，vertical 沿 Y 轴调整高度 */
  direction?: 'horizontal' | 'vertical'
  defaultSize: number
  minSize: number
  maxSize: number
  onResize: (size: number) => void
  /** 尺寸小于 minSize 时触发，参数为本次计算出的原始尺寸（可能小于 minSize），由外部决定是否收起 */
  onCloseLessMinSize?: (size: number) => void
  /** 开始拖动 */
  onResizeStart?: () => void
  /** 结束拖动（含拖动中被卸载） */
  onResizeEnd?: () => void
}

// 面板位于分隔条左侧 / 上方时，坐标增量与尺寸增量同向
const SIZE_SIGN: Record<CloseFit, 1 | -1> = {
  left: 1,
  right: -1,
  top: 1,
  bottom: -1
}

export const ResizeDivider = ({
  closeFit = 'left',
  direction = 'horizontal',
  defaultSize,
  minSize,
  maxSize,
  onResize,
  onCloseLessMinSize,
  onResizeStart,
  onResizeEnd
}: ResizeDividerProps) => {
  const [size, setSize] = useState(defaultSize)
  const dragRef = useRef<{
    startSize: number
    startPoint: { x: number; y: number }
  } | null>(null)
  // 卸载清理只能拿到首次渲染的闭包，用 ref 保证回调是最新的
  const onResizeEndRef = useRef(onResizeEnd)
  onResizeEndRef.current = onResizeEnd

  // 外部尺寸变化（状态同步、持久化恢复等）时保持内部尺寸一致
  useEffect(() => {
    setSize(defaultSize)
  }, [defaultSize])

  // 拖动中若分隔条被卸载（如外部收起面板），恢复页面选中状态并通知外部
  useEffect(() => {
    return () => {
      document.body.style.userSelect = ''
      if (dragRef.current) onResizeEndRef.current?.()
    }
  }, [])

  const finishDrag = (el: HTMLElement, pointerId: number) => {
    dragRef.current = null
    document.body.style.userSelect = ''
    if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId)
    onResizeEnd?.()
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragRef.current = {
      startSize: size,
      startPoint: { x: e.clientX, y: e.clientY }
    }
    // 拖动过程中禁止选中文本
    document.body.style.userSelect = 'none'
    // 指针捕获，保证鼠标移出分隔条后仍能收到事件
    e.currentTarget.setPointerCapture(e.pointerId)
    onResizeStart?.()
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return

    const delta =
      direction === 'horizontal'
        ? e.clientX - drag.startPoint.x
        : e.clientY - drag.startPoint.y
    const next = drag.startSize + delta * SIZE_SIGN[closeFit]
    // 视觉上始终夹在 [minSize, maxSize]，小于 minSize 时停在最小值
    const clamped = Math.min(Math.max(next, minSize), maxSize)

    if (clamped !== size) {
      setSize(clamped)
      onResize(clamped)
    }

    // 传原始尺寸给外部，由外部根据自身阈值决定是否收起面板
    if (next < minSize) onCloseLessMinSize?.(next)
  }

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    finishDrag(e.currentTarget, e.pointerId)
  }

  return (
    <div
      className={`shrink-0 touch-none z-999 bg-transparent hover:bg-blue-500/40 transition-colors ${
        direction === 'horizontal'
          ? 'w-1 h-full cursor-col-resize'
          : 'w-full h-1 cursor-row-resize'
      }`}
      onClick={e => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  )
}

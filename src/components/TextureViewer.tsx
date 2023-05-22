import { useEffect, useRef } from 'react';
import styled from 'styled-components'


export class TexturePreview {
  scale = 1
  position: [number, number] = [0, 0];
  mouse: null | [number, number] = null;

  constructor(private el: HTMLElement) {
    this.el = el;

    this.el.addEventListener('wheel', e => {
      const d = 0.2 * Math.sign(-e.deltaY);

      this.scale *= 1 + d;

      this.resize();
    });

    this.handleEvents();
    this.resize();
  }

  handleEvents() {
    this.el.addEventListener('mousedown', this.handleDown.bind(this));
    window.addEventListener('mousemove', this.handleMove.bind(this));
    window.addEventListener('mouseup', this.handleUp.bind(this));

    this.el.addEventListener('touchstart', this.handleDown.bind(this));
    this.el.addEventListener('touchmove', this.handleMove.bind(this));
    this.el.addEventListener('touchend', this.handleUp.bind(this));
    this.el.addEventListener('touchcancel', this.handleUp.bind(this));
  }

  extractCoords(e: MouseEvent | TouchEvent): [number, number] {
    if (e instanceof TouchEvent)
      return [e.touches[0].clientX, e.touches[0].clientY]

    return [e.clientX, e.clientY]
  }

  handleDown(e: MouseEvent | TouchEvent) {
    this.mouse = this.extractCoords(e);
  }

  handleMove(e: MouseEvent | TouchEvent) {
    if (!this.mouse) return;
    e.preventDefault();
    const [x, y] = this.extractCoords(e);

    this.position[0] += x - this.mouse[0];
    this.position[1] += y - this.mouse[1];
    this.translate(...this.position);
    this.mouse = [x, y];
  }

  handleUp() {
    this.mouse = null;
  }

  update(src: string) {
    this.el.style.backgroundImage = `url('${src}')`;
    this.resize();
  }

  translate(x: number, y: number) {
    this.el.style.backgroundPosition = `${x}px ${y}px`;
  }

  resize() {
    if (this.el.clientWidth > this.el.clientHeight)
      this.el.style.backgroundSize = `auto ${100 * this.scale}%`;
    else this.el.style.backgroundSize = `${100 * this.scale}% auto`;
  }
}

const Styles = styled.div`
  width: 100%;
  height: 100%;
`

export function TextureViewer({ canvas }: { canvas: HTMLCanvasElement }) {
  const ref = useRef<HTMLDivElement>(null)
  const preview = useRef<TexturePreview>()

  useEffect(() => {
    preview.current?.update(canvas.toDataURL())
  }, [canvas])

  useEffect(() => {
    if (!ref.current) return

    preview.current = new TexturePreview(ref.current);
    const resize = () => preview.current?.resize()

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <Styles ref={ref} data-tour="texture-preview"></Styles>
  )
}

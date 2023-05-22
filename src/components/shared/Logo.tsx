import styled from 'styled-components';

const Picture = styled.picture`
  img {
    height: 2.8em;
    margin-top: 0.5em;
  }
`

export function Logo(props: { responsive?: boolean }) {
  const full = new URL('/logo-full.svg', import.meta.url).href
  const mini = new URL('/logo.svg', import.meta.url).href

  return (
    <Picture>
      <source srcSet={full} media="(min-width: 600px)" />
      <img src={props.responsive === false ? full : mini} alt="Logo" />
    </Picture>
  )
}

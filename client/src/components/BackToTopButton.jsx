import React from 'react'

export default function BackToTopButton() {

  const backToTop = () => {
    window.scrollTo(0, 0);
  }

  return (
    <button onClick={backToTop}>Back to Top</button>
  )
}
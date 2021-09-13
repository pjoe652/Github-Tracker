const particleStyle = {
  height: "100vh",
  width: "100vw",
  position: "fixed",
  zIndex: "-1",
  top: "0",
  left: "0"
}

const particleParams = {
  particles: {
    color: "#ffffff",
    links: {
      color: "#ffffff"
    },
    number: {
      value: 30,
      density: {
        enable: true,
        value_are: 800
      }
    }
  },
  background: {
    color: "#0f0f0f"
  }
}

export { particleParams, particleStyle } 
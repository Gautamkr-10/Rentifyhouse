import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"


// Remove the initial loader after the app is mounted
window.addEventListener("load", () => {
  const loader = document.querySelector(".initial-loader")
  if (loader) {
    loader.style.opacity = "0"
    setTimeout(() => {
      loader.style.display = "none"
    }, 500)
  }
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


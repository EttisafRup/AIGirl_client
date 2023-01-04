import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

const form = document.querySelector("form")
const chatContainer = document.querySelector("#chat_container")

let loadInterval

function loader(elm) {
  elm.textContent = ""
  loadInterval = setInterval(() => {
    elm.textContent += "."
    if (elm.textContent === "....") {
      elm.textContent = ""
    }
  }, 20)
}

function typeText(elm, txt) {
  let index = 0
  let interval = setInterval(() => {
    if (index !== txt.length) {
      elm.innerHTML += txt.charAt(index)
      index += 1
    } else {
      clearInterval(interval)
    }
  }, 20)
}

function generateUniqueID() {
  const _time_ = Date.now()
  return `id-${_time_}`
}

function chatStripe(isAi, value, uniqueID) {
  return `
    <div class="wrapper ${isAi && "ai"}" style="height: "50px">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt=${isAi ? "bot" : "ai"}/>
        </div>
    <div class="message" id=${uniqueID}>${value}</div>

      </div>
      </div>
    </div>
    `
}

const handleSubmit = async (e) => {
  e.preventDefault()
  const data = new FormData(form)
  const getPrompt = data.get("prompt")
  chatContainer.innerHTML += chatStripe(false, getPrompt)

  form.reset()

  const uniqueID = generateUniqueID()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueID)
  chatContainer.scrollTop = chatContainer.scrollHeight
  const messageDiv = document.getElementById(uniqueID)

  loader(messageDiv)

  // Fetch Data from the Server
  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: getPrompt }),
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = ""

  if (response.ok) {
    const data = await response.json()
    const trimmed = data.msg.replace("\n", "")

    console.log(messageDiv)

    typeText(messageDiv, trimmed)
    console.log(trimmed)
  } else {
    const err = await response.text()
    messageDiv.innerHTML = "Something went Wrong, try again later.!"
  }
}

form.addEventListener("submit", handleSubmit)
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})

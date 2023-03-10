import axios from "axios"
import bot from "./assets/girl.jpg"
import user from "./assets/boy.jpg"

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
  }, 50)
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

function generateUniqueID() {
  const _time_ = Date.now()
  return `id-${_time_}`
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
  const options = {
    method: "POST",
    url: import.meta.env.VITE_PATH,
    params: {
      user_id: "sample_user_id",
      message: `${getPrompt}`,
      from_name: "Rup",
      to_name: "Shizuka",
      situation: "Shizuka Loves Rup.",
      translate_from: "auto",
      translate_to: "auto",
    },
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": import.meta.env.VITE_SEC_KEY,
      "X-RapidAPI-Host": import.meta.env.VITE_SEC_HOST,
    },
    data: "{}",
  }

  const response = await axios.request(options)

  clearInterval(loadInterval)
  messageDiv.innerHTML = ""

  if (response.data) {
    const trimmed = response.data

    typeText(messageDiv, trimmed)
  } else {
    messageDiv.innerHTML = "Something went Wrong, try again later.!"
  }
}

form.addEventListener("submit", handleSubmit)
form.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e)
  }
})

const socket = io("ws://localhost:3000")

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }
})

socket.on("chatMessage", (data) => {
    console.log(data)
    addMessage(data)
})

socket.on("roomUsers", (data) => {
    console.log(data)
    addRoomData(data)
})

// envia mensagem
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit("chatMessage", message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            console.error(error)
            return
        }

        console.log("Message Delived!")
    });

})

// templating
const addMessage = (data) => {
    let template = '<div class="message">' +
        '<p>' +
        '<span class="message__name">' + data.username + '</span>' +
        '<span class="message__meta">' + moment().format('DD-MM-YYYY HH:mm:ss') + '</span>' +
        '</p>' +
        '<p>' + data.message + '</p>' +
        '</div>'
    document.getElementById("messages").innerHTML += template;
}

const addRoomData = (data) => {
    let template = '<h2 class="room-title">' + data.room + '</h2>' +
        '<h3 class="list-title">Users</h3>' +
        '<ul class="users">'
        + usersList(data.users) +
        '</ul>'
    document.querySelector('#sidebar').innerHTML = template
}

const usersList = (users) => {
    let usersList = '';
    users.forEach(user => {
        console.log(user.username)
        usersList += '<li>' + user.username + '</li>'
    })
    return usersList
}
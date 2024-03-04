let myUserName = '';
let socket = io();

/** inputs references */
const userNameTitle = document.getElementById("userNameTitle")
const messageInput = document.getElementById("messageInput")
const messagesLog = document.getElementById("messagesLog")


/** Socket events */

//listens
socket.on('chat messages',({messages})=>{
    messagesLog.innerHTML= ''
    messages.forEach(m => {
        messagesLog.innerHTML+= `${m.user}: ${m.message}<br/>`
    });
})

//emits
messageInput.addEventListener('keyup',(e)=>{
    if(e.key == 'Enter'){
        socket.emit('new message', {
            user: myUserName, 
            message: e.target.value 
        })
        e.target.value = ''
    }
})


/** Sweet alert */

Swal.fire({
    title: 'Login',
    text: 'Please enter your username to continue.',
    input: 'email',
    allowOutsideClick: false
    // inputValidator: (value)=>{
    //     if(!value){
    //         return 'We need a username to continue.'
    //     }
    // }
}).then((result)=>{
    myUserName = result.value;
    userNameTitle.innerHTML = myUserName;
})
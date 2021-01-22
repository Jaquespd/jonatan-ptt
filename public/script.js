const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  // host: '/',
  // port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const buttonTalk = document.getElementById("button-talk")
let isActiveOne = true;
let isActiveTwo = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
      console.log("btn0")
      buttonTalk.addEventListener('click', () => {
        isActiveOne = !isActiveOne
        console.log("CLICK", isActiveOne)
        if (isActiveOne) video.volume = 1;
        if (!isActiveOne) video.volume = 0;
        console.log("video", video.volume);
      })
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    console.log("btn")
    buttonTalk.addEventListener('click', () => {
      isActiveTwo = !isActiveTwo
      console.log("CLICK", isActiveTwo)
      if (isActiveTwo) video.volume = 1;
      if (!isActiveTwo) video.volume = 0;
      console.log("video", video.volume);
    })
  })
  call.on('close', () => {
    video.remove()
    buttonTalk.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  console.log("videoStream")

  
  
  

  // buttonTalk.removeEventListener('click', () => {
  //   isActive = !isActive
  //   console.log("CLICK", isActive)
  //   if (isActive) video.volume = 1;
  //   if (!isActive) video.volume = 0;
  //   console.log("video", video.volume);
  // })
  
  videoGrid.append(video)
}


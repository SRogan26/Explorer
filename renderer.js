document.getElementById('info').innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = 1080
canvas.height = 720

c.fillStyle = "black";
c.fillRect(0, 0, 1280, 720);

const practice = new Image();
practice.src = './img/PracticeProject.png'
const guy = new Image();
guy.src = './img/PracticeGuy.png'

practice.onload = ()=>{
    c.drawImage(practice,0,0)
    c.drawImage(guy,16,16)
}

window.addEventListener('keydown', (e)=>{
    switch(e.key){
        case 'ArrowUp':
            console.log(e.key)
            break;
        case 'ArrowDown':
            console.log(e.key)
            break;
        case 'ArrowLeft':
            console.log(e.key)
            break;
        case 'ArrowRight':
            console.log(e.key)
            break;
        case ' ':
            console.log(e.key)
            break;
        default:
            break;
    }
})

const funk = async () => {
    const res = await window.versions.ping();
    console.log(res)
}

funk();
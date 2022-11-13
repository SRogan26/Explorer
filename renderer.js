document.getElementById('info').innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

c.fillStyle = "black";
c.fillRect(0, 0, 1280, 720);

const funk = async () => {
    const res = await window.versions.ping();
    console.log(res)
}

funk();
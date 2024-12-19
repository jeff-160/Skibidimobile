const keys = {
    left: false,
    right: false,
    up: false,
    down: false
}

document.addEventListener("keyup", e => {
    switch (e.key.toLowerCase()) {
        case "ArrowLeft":
        case "a":
            keys.left = false
            break
        
        case "ArrowRight":
        case "d":
            keys.right = false
            break

        case "ArrowUp":
        case "w":
            keys.up = false
            break
        
        case "ArrowDown":
        case "s":
            keys.down = false
            break
    }
})

document.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
        case "ArrowLeft":
        case "a":
            keys.left = true
            break
            
        case "ArrowRight":
        case "d":
            keys.right = true
            break
            
        case "ArrowUp":
        case "w":
                    keys.up = true
                    break
                    
        case "ArrowDown":
        case "s":
            keys.down = true
            break
    }
})

function EventLoop() {
    window.requestAnimationFrame(EventLoop)

    const magnitude = 0.05

    if (keys.left || keys.right) {
        wheels.forEach(wheel => {
            Body.applyForce(wheel, 
                {
                    x: wheel.position.x,
                    y: wheel.position.y - wheel.circleRadius
                }, 
                {
                    x: magnitude * (keys.left ? -1 : 1),
                    y: 0
                }
            )
        })
    }

    else if (keys.up || keys.down) {
        Body.rotate(toilet, magnitude * (keys.up ? -1 : 1))
    }
}

EventLoop()
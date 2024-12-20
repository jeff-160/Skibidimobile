const { Engine, Render, Runner, Body, Bodies, World, Vertices, Constraint, Events } = Matter
let engine, render, canvas
let wheels = [], toilet

function Init() {
    Matter.Common.setDecomp(decomp)

    engine = Engine.create()
    
    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false
        }
    })

    canvas = render.canvas
    canvas.classList.add("Centered")

    const background = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, {
        isStatic: true,
        render: {
            sprite: {
                texture: "assets/background.png",
            }
        }
    })
    background.collisionFilter = -1
    ScaleTexture(background)

    World.add(engine.world, background)

    Render.run(render)
    Runner.run(Runner.create(), engine)
}

function AddBounds() {
    const ground = Bodies.rectangle(0, 0, window.innerWidth, window.innerHeight / 7, { 
        isStatic: true,
        render: {
            fillStyle: "grey"
        }
    })

    Body.setPosition(ground, {
        x: window.innerWidth / 2, 
        y: window.innerHeight - GetSize(ground, "height") / 2
    })

    const leftWall = Bodies.rectangle(0, 0, 100, window.innerHeight, { isStatic: true })
    Body.setPosition(leftWall, {
        x: -GetSize(leftWall, "width") / 2,
        y: window.innerHeight / 2
    })
    
    const rightWall = Bodies.rectangle(0, 0, 100, window.innerHeight, { isStatic: true })
    Body.setPosition(rightWall, {
        x: window.innerWidth + GetSize(rightWall, "width") / 2,
        y:  window.innerHeight / 2
    })
    
    const topWall = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 1, { isStatic: true })

    World.add(engine.world, [ground, leftWall, rightWall, topWall])
}

function CreateWheel(car, x) {
    const wheel = Bodies.circle(200, 0, 35, {
        friction: 0.8,
        restitution: 0.8,
        render: {
            sprite: {
                texture: "assets/wheel.png"
            }
        }
    })

    ScaleTexture(wheel)

    const axle = Constraint.create({
        bodyA: car,
        pointA: {x: x, y: GetSize(car, "height") / 2}, 
        bodyB: wheel,
        length: 0,
        stiffness: 1,
        damping: 1
    })

    wheel.collisionFilter.group = -1;
    car.collisionFilter.group = -1;

    wheels.push(wheel)

    return [wheel, axle]
}

async function CreateCar() {
    toilet = await LoadSprite("toilet.png", "toilet.json", 100, canvas.clientHeight / 2, 0.5, {
        restitution: 0
    })

    const parts = [
        ...CreateWheel(toilet, -40),
        ...CreateWheel(toilet, 60)
    ]

    World.add(engine.world, [...parts, toilet])
}

function PlayMusic() {
    const audio = new Audio()
    audio.src = "assets/music.mp3"
    audio.loop = true
    
    audio.play()
}

async function LoadScene() {
    document.body.removeChild(document.querySelector("button"))

    Init()
    AddBounds()

    const von = await LoadSprite("von.png", "von.json", canvas.clientWidth / 2, canvas.clientHeight / 2, 0.4, {
        label: "von",
        friction: 0.8,
        restitution: 0.8,
    })

    World.add(engine.world, von)

    await CreateCar()
    
    EventLoop()

    PlayMusic()
}
import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, NodeEventType, Graphics, Vec2, UITransform, PolygonCollider2D, RigidBody2D, BoxCollider2D, ERigidBody2DType, Prefab, instantiate, Vec3 } from 'cc';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('DrawingController')
export class DrawingController extends Component {
    @property (Node)    
    private drawing: Node
    @property (Prefab)
    private line: Prefab

    private pointsCollider : Vec2[] = []
    private physics: PhysicsSystem2D

    onLoad() {
        PhysicsSystem2D.instance.debugDrawFlags =   EPhysics2DDrawFlags.Aabb |
                                                    EPhysics2DDrawFlags.Pair |
                                                    EPhysics2DDrawFlags.CenterOfMass |
                                                    EPhysics2DDrawFlags.Joint |
                                                    EPhysics2DDrawFlags.Shape


        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None

        const game = this.node.parent.getComponent(GamePlay)

        const polygonCollider = this.drawing.getComponent(PolygonCollider2D)

        this.node.on(NodeEventType.TOUCH_START, function(event) {
            if(game.isGameRunning) return

            this.lastPos = event.getUILocation();
        }, this)
        
        this.node.on(NodeEventType.TOUCH_MOVE, function(event) {
            if(game.isGameRunning) return

            polygonCollider.points = []
            polygonCollider.apply()

            const graphic = this.drawing.getComponent(Graphics);
            const {width, height} = this.drawing.getComponent(UITransform)

            graphic.moveTo(this.lastPos.x - width/2, this.lastPos.y - height/2);
            graphic.lineTo(event.getUILocation().x - width/2, event.getUILocation().y - height/2);
            graphic.stroke();

            this.pointsCollider.push(new Vec2(event.getLocation().x - width/2, event.getUILocation().y - height/2))

            // let line = instantiate(this.line)

            // line.parent = this.drawing

            // line.setPosition(new Vec3(event.getLocation().x - width/2,event.getUILocation().y - height/2,0))

            this.lastPos = event.getUILocation();
        }, this);

        // const listPoints = []

        // listPoints.push(new Vec2(0,0))
        // listPoints.push(new Vec2(10,10))
        // listPoints.push(new Vec2(25,20))
        // listPoints.push(new Vec2(30,30))
        // listPoints.push(new Vec2(40,40))
        // listPoints.push(new Vec2(40,45))
        // listPoints.push(new Vec2(30,35))
        // listPoints.push(new Vec2(25,25))
        // listPoints.push(new Vec2(10,15))
        // listPoints.push(new Vec2(0,5))

        this.node.on(NodeEventType.TOUCH_END, function() {
            if(game.isGameRunning) return

            const listPoint1 = []
            const listPoint2 = []

            this.pointsCollider.forEach((element: Vec2) => {
                console.log('element1', element)
                const element2 = new Vec2(element.x-2.5, element.y)
                const element3 = new Vec2(element.x+2.5, element.y)
                listPoint1.push(element2)
                listPoint2.push(element3)
                console.log('element2', element2)
            })

            listPoint2.reverse()

            const listPoints = listPoint1.concat(listPoint2)

            console.log('Test', this.pointsCollider, listPoint1, listPoints)

            polygonCollider.points = listPoints
            polygonCollider.apply()

            // polygonCollider.points = this.pointsCollider
            // polygonCollider.apply()

            game.countdownTimer()
            game.spawnOwls()
            game.setDogGravity()
        }, this)
    }
}



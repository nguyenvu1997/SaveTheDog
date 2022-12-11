import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, NodeEventType, Graphics, Vec2, UITransform, PolygonCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrawingController')
export class DrawingController extends Component {
    @property (Node)    
    private drawing: Node

    private pointsCollider : Vec2[] = []

    onLoad() {
        PhysicsSystem2D.instance.debugDrawFlags =   EPhysics2DDrawFlags.Aabb |
                                                    EPhysics2DDrawFlags.Pair |
                                                    EPhysics2DDrawFlags.CenterOfMass |
                                                    EPhysics2DDrawFlags.Joint |
                                                    EPhysics2DDrawFlags.Shape

        this.node.on(NodeEventType.TOUCH_START, function(event) {
            this.lastPos = event.getUILocation();
        }, this)
        
        this.node.on(NodeEventType.TOUCH_MOVE, function(event) {
            const polygonCollider = this.drawing.getComponent(PolygonCollider2D)

            polygonCollider.points = []

            polygonCollider.apply()

            const graphic = this.drawing.getComponent(Graphics);
            const {width, height} = this.drawing.getComponent(UITransform)

            graphic.moveTo(this.lastPos.x - width/2, this.lastPos.y - height/2);
            graphic.lineTo(event.getUILocation().x - width/2, event.getUILocation().y - height/2);
            graphic.stroke();

            this.pointsCollider.push(new Vec2(event.getLocation().x - width/2, event.getUILocation().y - height/2))

            this.lastPos = event.getUILocation();
        }, this);

        this.node.on(NodeEventType.TOUCH_END, function() {
            // const polygonCollider = this.drawing.getComponent(PolygonCollider2D)

            // polygonCollider.points = this.pointsCollider

            // polygonCollider.apply()

            const game = this.node.parent.getComponent('GamePlay')

            game.countdownTimer()
            game.spawnOwls()
            game.setDogGravity()
        }, this)
    }
}



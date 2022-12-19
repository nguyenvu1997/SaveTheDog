import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, NodeEventType, Graphics, Vec2, UITransform, PolygonCollider2D, RigidBody2D, BoxCollider2D, ERigidBody2DType, Prefab, instantiate, Vec3 } from 'cc';
import { GamePlay } from './GamePlay';
const { ccclass } = _decorator;

@ccclass('DrawingController')
export class DrawingController extends Component {
    onLoad() {
        PhysicsSystem2D.instance.debugDrawFlags =   EPhysics2DDrawFlags.Aabb |
                                                    EPhysics2DDrawFlags.Pair |
                                                    EPhysics2DDrawFlags.CenterOfMass |
                                                    EPhysics2DDrawFlags.Joint |
                                                    EPhysics2DDrawFlags.Shape

        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None

        const game = this.node.parent.getComponent(GamePlay)
        const graphic = this.node.getComponent(Graphics);
        const rigidBody = graphic.node.addComponent(RigidBody2D)

        rigidBody.type = ERigidBody2DType.Static

        const {width: widthParent, height: heightParent} = this.node.parent.getComponent(UITransform)

        this.node.getComponent(UITransform).width = widthParent
        this.node.getComponent(UITransform).height = heightParent

        const {width, height} = this.node.getComponent(UITransform)

        this.node.on(NodeEventType.TOUCH_START, function(event) {
            if(game.isGameRunning) return

            this.lastPos = event.getUILocation();
        }, this)
        
        this.node.on(NodeEventType.TOUCH_MOVE, function(event) {
            if(game.isGameRunning) return

            graphic.moveTo(this.lastPos.x - width/2, this.lastPos.y - height/2);
            graphic.lineTo(event.getUILocation().x - width/2, event.getUILocation().y - height/2);
            graphic.stroke();

            const distance = Vec2.distance(new Vec2(this.lastPos.x, this.lastPos.y), new Vec2(event.getUILocation().x, event.getUILocation().y))

            if(distance < 20){
                return
            }

            if( this.lastPos.x == event.getUILocation().x && this.lastPos.y == event.getUILocation().y) {
                return
            }

            const listPoint = [ new Vec2(this.lastPos.x - width/2 - 2.5, this.lastPos.y - height/2 - 2.5),
                                new Vec2(event.getUILocation().x - width/2 - 2.5, event.getUILocation().y - height/2 - 2.5),
                                new Vec2(event.getUILocation().x - width/2 + 2.5, event.getUILocation().y - height/2 + 2.5),
                                new Vec2(this.lastPos.x - width/2 + 2.5, this.lastPos.y - height/2 + 2.5)]

            const collider = rigidBody.node.addComponent(PolygonCollider2D)
            collider.group = 2

            collider.points = listPoint 
            collider.apply()

            this.lastPos = event.getUILocation();
        }, this);

        this.node.on(NodeEventType.TOUCH_END, function() {
            if(game.isGameRunning) return
            
            rigidBody.type = ERigidBody2DType.Dynamic
            rigidBody.wakeUp()

            game.countdownTimer()
            game.spawnOwls()
            game.setDogGravity()
        }, this)
    }
}

import { _decorator, Component, Node, PhysicsSystem2D, EPhysics2DDrawFlags, NodeEventType, Graphics, Vec2, UITransform, PolygonCollider2D, RigidBody2D, BoxCollider2D, ERigidBody2DType, Prefab, instantiate, Vec3 } from 'cc';
import { AStar } from './AStar';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('DrawingController')
export class DrawingController extends Component {
    @property (Node)
    private ex1: Node
    @property (Node)
    private ex2: Node

    private isCollider: boolean = false

    private aStart: AStar

    onLoad() {
        PhysicsSystem2D.instance.debugDrawFlags =   EPhysics2DDrawFlags.Aabb |
                                                    EPhysics2DDrawFlags.Pair |
                                                    EPhysics2DDrawFlags.CenterOfMass |
                                                    EPhysics2DDrawFlags.Joint |
                                                    EPhysics2DDrawFlags.Shape

        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None

        this.aStart = new AStar()

        const game = this.node.parent.getComponent(GamePlay)
        const graphic = this.node.getComponent(Graphics);
        let rigidBody = this.node.addComponent(RigidBody2D)

        rigidBody.type = ERigidBody2DType.Static

        const {width: widthParent, height: heightParent} = this.node.parent.getComponent(UITransform)

        this.node.getComponent(UITransform).width = widthParent
        this.node.getComponent(UITransform).height = heightParent

        const {width, height} = this.node.getComponent(UITransform)

        this.node.on(NodeEventType.TOUCH_START, function(event) {
            if(game.isGameRunning) return

            this.isCollider = this.aStart.checkPoint(new Vec2(event.getUILocation().x, event.getUILocation().y))

            if(this.isCollider) return

            rigidBody.destroy()
            rigidBody = this.node.addComponent(RigidBody2D)
            rigidBody.type = ERigidBody2DType.Static

            this.lastPos = event.getUILocation();
        }, this)
        
        this.node.on(NodeEventType.TOUCH_MOVE, function(event) {
            if(game.isGameRunning) return

            if(this.isCollider) return

            // this.aStart.checkDirectionCanMove(new Vec3(event.getUILocation().x, event.getUILocation().y, 0), this.ex1, this.ex2)

            const startPoint = new Vec2(this.lastPos.x, this.lastPos.y)
            const endPoint = new Vec2(event.getUILocation().x, event.getUILocation().y)

            const distance = Vec2.distance(startPoint, endPoint)

            if(distance < 20){
                return
            }

            const isCollider = this.aStart.checkRay(endPoint, startPoint)

            console.log('isCollider', isCollider)

            if(isCollider) {
                return
            }
            
            graphic.moveTo(this.lastPos.x - width/2, this.lastPos.y - height/2);
            graphic.lineTo(event.getUILocation().x - width/2, event.getUILocation().y - height/2);
            graphic.stroke();

            if( this.lastPos.x == event.getUILocation().x && this.lastPos.y == event.getUILocation().y) {
                return
            }

            const listPoint = [ new Vec2(this.lastPos.x - width/2 - 2.5, this.lastPos.y - height/2 - 2.5),
                                new Vec2(event.getUILocation().x - width/2 - 2.5, event.getUILocation().y - height/2 - 2.5),
                                new Vec2(event.getUILocation().x - width/2 + 2.5, event.getUILocation().y - height/2 + 2.5),
                                new Vec2(this.lastPos.x - width/2 + 2.5, this.lastPos.y - height/2 + 2.5)]

            const collider = this.node.addComponent(PolygonCollider2D)
            collider.group = 2

            collider.points = listPoint 
            collider.apply()

            this.lastPos = event.getUILocation();
        }, this);

        this.node.on(NodeEventType.TOUCH_END, function() {
            if(game.isGameRunning) return

            if(this.isCollider) return
            
            rigidBody.type = ERigidBody2DType.Dynamic
            rigidBody.wakeUp()

            game.countdownTimer()
            game.spawnOwls()
            game.setDogGravity()
        }, this)
    }
}

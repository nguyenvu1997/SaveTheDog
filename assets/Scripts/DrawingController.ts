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

            const startPoint = new Vec2(this.lastPos.x, this.lastPos.y)
            const endPoint = new Vec2(event.getUILocation().x, event.getUILocation().y)

            const isCollider = this.aStart.checkRay(endPoint, startPoint)

            if(isCollider) return

            if(this.aStart.checkPoint(endPoint)) return

            if(startPoint.x == endPoint.x && startPoint.y == endPoint.y) return
            
            graphic.moveTo(startPoint.x - width/2, startPoint.y - height/2);
            graphic.lineTo(endPoint.x - width/2, endPoint.y - height/2);
            graphic.stroke();

            this.createPolygon(startPoint,endPoint,width,height)

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

    private createPolygon(startPoint: Vec2, endPoint: Vec2, width: number, height: number): void{
        const vec = new Vec2(endPoint.x - startPoint.x, endPoint.y - startPoint.y).normalize()
        vec.rotate(Math.PI / 2)

        const offset = 2.5

        const listPoint = [ new Vec2(startPoint.x - width / 2 - vec.x * offset, startPoint.y - height / 2 - vec.y * offset),
                            new Vec2(endPoint.x - width / 2 - vec.x * offset, endPoint.y - height / 2 - vec.y * offset),
                            new Vec2(endPoint.x - width / 2 + vec.x * offset, endPoint.y - height / 2 + vec.y * offset),
                            new Vec2(startPoint.x - width / 2 + vec.x * offset, startPoint.y - height / 2 + vec.y * offset)]

        const collider = this.node.addComponent(PolygonCollider2D)
        collider.group = 2
        collider.points = listPoint 
        collider.apply()
    }
}

import { _decorator, Component, Node, Vec3, tween, Collider2D, IPhysics2DContact, Contact2DType, Tween, UITransform, easing, Vec2, RigidBody2D, Animation } from 'cc';
import { AStar } from './AStar';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('OwlController')
export class OwlController extends Component {
    @property (Node)
    private owl: Node

    private dog: Node
    private dogPosition: Vec3

    private tweenMove: Tween<Node>
    private aStart: AStar

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log('onBeginContact', otherCollider.node.name, otherCollider.node.position)

        if(otherCollider.node.name == 'Dog'){
            const dogNormal = this.dog.getChildByName('dog-normal')
            const dogStung = this.dog.getChildByName('dog-stung')
            dogNormal.active = false
            dogStung.active = true

            this.tweenMove.stop()

            const game = this.node.parent.getComponent(GamePlay)
            game.showPopupLose()

            return
        }

        if(otherCollider.node.name != 'Owl'){
            this.tweenMove.stop()

            if(otherCollider.node.name == 'Drawing'){
                const rigidBody2D = otherCollider.node.getComponent(RigidBody2D)
                rigidBody2D.applyAngularImpulse(20, true)
            }
        }

        this.scheduleOnce(this.resetTargetPosition, 0.5)
    }

    public start() {
        this.aStart = new AStar()

        let collider = this.getComponent(Collider2D)

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }

        const animation = this.node.getComponent(Animation)
        animation.play('bee_fly')
    }

    public setTargetPosition(dog: Node): void{
        this.dog = dog
        this.dogPosition = this.dog.getPosition()

        const startPoint = new Vec2(this.node.position.x, this.node.position.y)
        const endPoint = new Vec2(this.dogPosition.x, this.dogPosition.y)
        const offsetY = Math.floor(Math.random() * 300) - 150
        const controlPoint = new Vec2((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2 + offsetY)

        let tweenDuration: number = 1.0;

        this.tweenMove = tween(this.node)
        .to(tweenDuration, { position: new Vec3(this.dogPosition) }, {
            easing: easing.linear,
            onUpdate: (target: Node, ratio: number) => {
                target.setPosition(this.twoBezier(ratio, startPoint, controlPoint, endPoint))
            }
        })
        .start()
    }

    twoBezier = (t:number, p1: Vec2, cp: Vec2, p2: Vec2) => {
        let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
        let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
        return new Vec3(x, y, 0);
    };

    private resetTargetPosition(): void{
        this.dogPosition = this.dog.getPosition()

        const startPoint = new Vec2(this.node.position.x, this.node.position.y)

        const offsetX1 = Math.floor(Math.random() * 200) - 100
        const offsetY1 = Math.floor(Math.random() * 160) - 80
        const endPoint = new Vec2(this.dogPosition.x + offsetX1, this.dogPosition.y + offsetY1)

        const offsetX = Math.floor(Math.random() * 100) - 50
        const offsetY = Math.floor(Math.random() * 400) - 200
        const controlPoint = new Vec2((startPoint.x + endPoint.x) / 2 + offsetX, (startPoint.y + endPoint.y) / 2 + offsetY)

        let tweenDuration: number = 1.0;

        this.tweenMove = tween(this.node)
        .to(tweenDuration, { position: new Vec3(this.dogPosition) }, {
            easing: easing.linear,
            onUpdate: (target: Node, ratio: number) => {
                target.setPosition(this.twoBezier(ratio, startPoint, controlPoint, endPoint))
            },
            onComplete: () => {
                console.log('Complete')
                this.resetTargetPosition()
            }
        })
        .start()
    }
}



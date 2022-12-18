import { _decorator, Component, Node, Vec3, tween, Collider2D, IPhysics2DContact, Contact2DType, Tween, UITransform } from 'cc';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('OwlController')
export class OwlController extends Component {
    @property (Node)
    private owl: Node

    private dogPosition: Vec3

    private tweenMove: Tween<Node>

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log('onBeginContact', otherCollider.node.name, otherCollider.node.position)

        // if(otherCollider.node.name == 'Dog') {
        //     this.node.destroy()
        //     return
        // }

        if(otherCollider.node.name != 'Owl'){
            this.tweenMove.stop()
        }

        //else {
        //     this.scheduleOnce(this.resetTargetPosition, 0.5)
        //     return
        // }

        // this.scheduleOnce(() => {
        //     this.moveAvoidObstacles(otherCollider.node)
        // }, 0.5)

        this.scheduleOnce(this.resetTargetPosition, 0.5)
    }

    public start() {
        let collider = this.getComponent(Collider2D)

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    public setTargetPosition(dogPosition: Vec3): void{
        this.dogPosition = dogPosition

        let tweenDuration: number = 1.0;
        this.tweenMove = tween(this.node)
        .to(tweenDuration, { position: new Vec3(dogPosition) }, {
            easing: "linear",
        })
        .start()
    }

    private moveAvoidObstacles(obstacle: Node): void{
        const obstaclePos = obstacle.getPosition()
        const owlPos = this.node.getPosition()

        let offsetX = obstaclePos.x - owlPos.x
        const offsetY = obstaclePos.y - owlPos.y

        if(offsetX > 0) offsetX += obstacle.getComponent(UITransform).width
        if(offsetX < 0) offsetX -= obstacle.getComponent(UITransform).width

        const targetPos = new Vec3(owlPos.x + offsetX, owlPos.y + offsetY,0)

        let tweenDuration: number = 1.0;
        this.tweenMove = tween(this.node)
        .to(tweenDuration, { position: new Vec3(targetPos) }, {
            easing: "linear",
            onComplete: () => {
                this.resetTargetPosition();
            }
        })
        .start()
    }

    private resetTargetPosition(): void{
        let tweenDuration: number = 1.0;
        this.tweenMove = tween(this.node)

        .to(tweenDuration, { position: new Vec3(this.dogPosition) }, {
            easing: "linear",
        })
        .start()
    }
}



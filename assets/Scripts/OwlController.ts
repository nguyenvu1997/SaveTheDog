import { _decorator, Component, Node, Vec3, tween, Collider2D, IPhysics2DContact, PhysicsSystem2D, Contact2DType } from 'cc';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('OwlController')
export class OwlController extends Component {
    @property (Node)
    private owl: Node

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log('onBeginContact', otherCollider.node.name)

        if(otherCollider.node.name == 'Dog'){
            const game = this.node.parent.getComponent(GamePlay)

            game.showPopupLose()
        }
    }

    public start() {
        let collider = this.getComponent(Collider2D)

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    public setTargetPosition(dogPosition: Vec3, owl: Node): void{
        let tweenDuration: number = 1.0;
        tween(owl)
        .to(tweenDuration, { position: new Vec3(dogPosition) }, {
            easing: "linear",
        })
        .start()
    }
}


